import logging
from pathlib import Path

import google.generativeai as genai
import graphene
import yaml
from django.conf import settings
from django.db import transaction

from app.models.game import TextPair
from app.utils.constants import TextGeneratorErrorMessages
from app.utils.errors import BaseError
from app.utils.graphql_throttling import get_user_identifier, graphql_throttle

logger = logging.getLogger("app")


class TextGeneratorError(BaseError):
    """テキスト生成に関するエラーを表す例外クラス"""

    def __init__(
        self,
        message: str,
        code: str = "TEXT_GENERATOR_ERROR",
        details: list[str] | None = None,
    ):
        super().__init__(
            message=message,
            code=code,
            status=400,
            details=details,
        )


class TextGenerator:
    def __init__(self, api_key=None):
        logger.info("TextGenerator初期化開始")
        try:
            api_key = api_key or settings.GEMINI_API_KEY
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel(settings.GEMINI_MODEL)

            # 設定ファイルの読み込み
            base_path = Path(__file__).parent.parent.parent / "text_generation"
            logger.info(f"設定ファイル読み込み開始: {base_path}")

            with open(base_path / "prompts.yaml", encoding="utf-8") as f:
                self.prompts = yaml.safe_load(f)

            logger.info("TextGenerator初期化完了")
        except Exception as e:
            logger.error(f"TextGenerator初期化エラー: {str(e)}", exc_info=True)
            raise TextGeneratorError(
                message=TextGeneratorErrorMessages.INITIALIZATION_ERROR,
                details=[str(e)],
            )

    def _call_ai_for_text_generation(self, prompt):
        """AIを呼び出してテキストを生成するヘルパーメソッド"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except genai.types.BlockedPromptException as e:
            logger.warning(f"AIテキスト生成でブロックされました: {e}")
            raise TextGeneratorError(
                message=TextGeneratorErrorMessages.TEXT_GENERATION_ERROR,
                details=[str(e)],
            )
        except Exception as e:
            logger.warning(f"AIテキスト生成でエラーが発生しました: {e}")
            raise TextGeneratorError(
                message=TextGeneratorErrorMessages.TEXT_GENERATION_ERROR,
                details=[str(e)],
            )

    def generate_text(self):
        logger.info("テキスト生成開始")
        try:
            # プロンプトを取得
            prompt = self.prompts["typing_prompt"]
            logger.info(f"プロンプト取得完了: prompt_len={len(prompt)}")

            # AIにリクエストを送る
            logger.info("AIリクエスト送信")
            generated_text = self._call_ai_for_text_generation(prompt)
            logger.info("AIレスポンス受信")

            # 生成されたテキストを整形
            try:
                sentences = [
                    sentence.strip()
                    for sentence in generated_text.strip().split("\n")
                    if sentence.strip()
                ]  # 空行を削除し、各行をトリム

                # 各文章をTextPairテーブルに保存
                saved_sentences = []
                with transaction.atomic():
                    for i, sentence in enumerate(sentences):
                        if sentence:
                            # TextPairテーブルに保存
                            text_pair = TextPair.objects.create(
                                kanji=sentence, is_converted=False
                            )
                            saved_sentences.append(
                                {"text": sentence, "id": text_pair.id}
                            )

                logger.info(f"テキスト生成完了: sentences_count={len(saved_sentences)}")
                result = {
                    "sentences": saved_sentences,
                }
                return result
            except TextGeneratorError:
                raise
            except Exception as e:
                logger.error(f"レスポンス処理エラー: {str(e)}", exc_info=True)
                raise TextGeneratorError(
                    message=TextGeneratorErrorMessages.RESPONSE_PROCESSING_ERROR,
                    details=[str(e)],
                )

        except TextGeneratorError:
            raise
        except Exception as e:
            logger.error(f"テキスト生成エラー: {str(e)}", exc_info=True)
            raise TextGeneratorError(
                message=TextGeneratorErrorMessages.TEXT_GENERATION_ERROR,
                details=[str(e)],
            )


class TextSentenceType(graphene.ObjectType):
    """生成された文章のGraphQL型定義"""

    id = graphene.Int()
    text = graphene.String()


class GenerateText(graphene.Mutation):
    """AIAPIを使用して漢字を含む文章を100文生成し、テーブルのkanjiカラムに格納するミューテーション"""

    class Arguments:
        pass

    sentences = graphene.List(TextSentenceType)
    error = graphene.String()

    @classmethod
    @graphql_throttle("5/m", get_user_identifier)
    def mutate(cls, root, info):
        logger.info("テキスト生成ミューテーション開始")
        try:
            generator = TextGenerator()
            result = generator.generate_text()

            # 生成結果本体はログ出力しない（ログ肥大/機密性の観点）
            logger.info(
                f"TextGenerator結果メタ: sentences_count={len(result.get('sentences', []))}"
            )

            if "error" in result:
                logger.error(f"テキスト生成失敗: {result['error']}")
                return GenerateText(error=result["error"])

            if "sentences" not in result:
                logger.error(f"sentencesフィールドが見つかりません: {result}")
                return GenerateText(error="sentencesフィールドが見つかりません")

            logger.info("テキスト生成成功")
            sentences = [
                TextSentenceType(**sentence) for sentence in result["sentences"]
            ]
            logger.info(f"生成されたsentences数: {len(sentences)}")

            return GenerateText(
                sentences=sentences,
            )
        except TextGeneratorError as e:
            logger.error(f"TextGeneratorError: {str(e)}", exc_info=True)
            return GenerateText(error=f"{e.message}: {str(e)}")
        except Exception as e:
            logger.error(f"テキスト生成ミューテーションエラー: {str(e)}", exc_info=True)
            return GenerateText(
                error=f"{TextGeneratorErrorMessages.TEXT_GENERATION_ERROR}: {str(e)}"
            )
