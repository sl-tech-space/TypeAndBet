import yaml
import random
import google.generativeai as genai
from pathlib import Path
import graphene
from django.conf import settings
import logging
from app.utils.constants import TextGeneratorErrorMessages
from app.utils.errors import BaseError
from typing import List, Optional

logger = logging.getLogger("app")


class TextGeneratorError(BaseError):
    """テキスト生成に関するエラーを表す例外クラス"""

    def __init__(
        self,
        message: str,
        code: str = "TEXT_GENERATOR_ERROR",
        details: Optional[List[str]] = None,
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

            with open(base_path / "prompts.yaml", "r", encoding="utf-8") as f:
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
            logger.info(f"プロンプト取得完了: {len(prompt)}文字")

            # AIにリクエストを送る
            logger.info("AIリクエスト送信")
            generated_text = self._call_ai_for_text_generation(prompt)
            logger.info("AIレスポンス受信")
            logger.info(f"生成されたテキストの長さ: {len(generated_text)}文字")

            # 生成されたテキストを整形
            try:
                lines = [
                    line.strip()
                    for line in generated_text.strip().split("\n")
                    if line.strip()
                ]  # 空行を削除し、各行をトリム

                logger.info(f"生成された行数: {len(lines)}")

                # 期待される行数（100行）のチェック
                # 50行以上生成できれば成功とする
                if len(lines) < 50:
                    logger.warning(
                        f"生成された行数が最小要件を満たしていません: {len(lines)}行 (最小要件: 50行)。"
                    )
                    raise TextGeneratorError(
                        message=TextGeneratorErrorMessages.RESPONSE_PROCESSING_ERROR,
                        details=[
                            f"生成された行数が最小要件(50行)を満たしていません。現在の行数: {len(lines)}"
                        ],
                    )

                # 各文章をそのまま使用
                sentences = []
                for i, line in enumerate(lines):
                    if line:
                        sentences.append({"text": line})
                        if i < 5:  # 最初の5行をログに出力
                            logger.info(f"文章{i + 1}: {line}")

                # 最終的な文章数のチェック (最小20文章以上を期待)
                if len(sentences) < 20:
                    logger.warning(
                        f"生成された文章数が最小要件を満たしていません: {len(sentences)}文章 (最小要件: 20文章)。"
                    )
                    raise TextGeneratorError(
                        message=TextGeneratorErrorMessages.RESPONSE_PROCESSING_ERROR,
                        details=[
                            f"生成された文章数が最小要件(20文章)を満たしていません。現在の文章数: {len(sentences)}"
                        ],
                    )

                logger.info(f"テキスト生成完了: sentences_count={len(sentences)}")
                result = {
                    "sentences": sentences,
                }
                logger.info(f"返却する結果: {result}")
                return result
            except TextGeneratorError:  # TextGeneratorErrorの場合は再スロー
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
    text = graphene.String()


class GenerateText(graphene.Mutation):
    class Arguments:
        pass

    sentences = graphene.List(TextSentenceType)
    error = graphene.String()

    @classmethod
    def mutate(cls, root, info):
        logger.info("テキスト生成ミューテーション開始")
        try:
            generator = TextGenerator()
            result = generator.generate_text()

            logger.info(f"TextGenerator結果: {result}")

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
