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

            with open(base_path / "themes.yaml", "r", encoding="utf-8") as f:
                self.theme_categories = yaml.safe_load(f)
            with open(base_path / "prompts.yaml", "r", encoding="utf-8") as f:
                self.prompts = yaml.safe_load(f)

            logger.info("TextGenerator初期化完了")
        except Exception as e:
            logger.error(f"TextGenerator初期化エラー: {str(e)}", exc_info=True)
            raise TextGeneratorError(
                message=TextGeneratorErrorMessages.INITIALIZATION_ERROR,
                details=[str(e)],
            )

    def _get_random_theme(self):
        logger.info("ランダムテーマ選択開始")
        try:
            category = random.choice(list(self.theme_categories.keys()))
            theme = random.choice(self.theme_categories[category])
            logger.info(f"テーマ選択完了: category={category}, theme={theme}")
            return theme, category
        except Exception as e:
            logger.error(f"テーマ選択エラー: {str(e)}", exc_info=True)
            raise TextGeneratorError(
                message=TextGeneratorErrorMessages.THEME_SELECTION_ERROR,
                details=[str(e)],
            )

    def _generate_prompt(self, theme, category=None):
        logger.info(f"プロンプト生成開始: theme={theme}, category={category}")
        try:
            category_info = f"（カテゴリー: {category}）" if category else ""
            prompt = self.prompts["typing_prompt"].format(
                theme=theme, category_info=category_info
            )
            logger.info("プロンプト生成完了")
            return prompt
        except Exception as e:
            logger.error(f"プロンプト生成エラー: {str(e)}", exc_info=True)
            raise TextGeneratorError(
                message=TextGeneratorErrorMessages.PROMPT_GENERATION_ERROR,
                details=[str(e)],
            )

    def generate_text(self):
        logger.info("テキスト生成開始")
        try:
            # ランダムなテーマとカテゴリーを選択
            theme, category = self._get_random_theme()

            # プロンプトを生成
            prompt = self._generate_prompt(theme, category)

            # AIにリクエストを送る
            logger.info("AIリクエスト送信")
            try:
                response = self.model.generate_content(prompt)
                generated_text = response.text
                logger.info("AIレスポンス受信")
            except Exception as e:
                logger.error(f"AIリクエストエラー: {str(e)}", exc_info=True)
                raise TextGeneratorError(
                    message=TextGeneratorErrorMessages.AI_REQUEST_ERROR,
                    details=[str(e)],
                )

            # 生成されたテキストを整形
            try:
                parts = generated_text.split("。")
                kanji_hiragana_pairs = []

                for i in range(0, len(parts) - 1, 2):
                    if i + 1 >= len(parts):
                        break

                    kanji_text = parts[i].strip()
                    hiragana_text = parts[i + 1].strip()

                    # 空のペアはスキップ
                    if kanji_text and hiragana_text:
                        kanji_hiragana_pairs.append(
                            {"kanji": kanji_text, "hiragana": hiragana_text}
                        )

                logger.info(
                    f"テキスト生成完了: pairs_count={len(kanji_hiragana_pairs)}"
                )
                return {
                    "theme": theme,
                    "category": category,
                    "pairs": kanji_hiragana_pairs,
                }
            except Exception as e:
                logger.error(f"レスポンス処理エラー: {str(e)}", exc_info=True)
                raise TextGeneratorError(
                    message=TextGeneratorErrorMessages.RESPONSE_PROCESSING_ERROR,
                    details=[str(e)],
                )

        except TextGeneratorError as e:
            logger.error(f"テキスト生成エラー: {str(e)}", exc_info=True)
            return {"error": str(e)}
        except Exception as e:
            logger.error(f"予期せぬエラー: {str(e)}", exc_info=True)
            return {
                "error": f"{TextGeneratorErrorMessages.TEXT_GENERATION_ERROR}: {str(e)}"
            }


class TextPairType(graphene.ObjectType):
    kanji = graphene.String()
    hiragana = graphene.String()


class GenerateText(graphene.Mutation):
    class Arguments:
        pass

    theme = graphene.String()
    category = graphene.String()
    pairs = graphene.List(TextPairType)
    error = graphene.String()

    @classmethod
    def mutate(cls, root, info):
        logger.info("テキスト生成ミューテーション開始")
        try:
            generator = TextGenerator()
            result = generator.generate_text()

            if "error" in result:
                logger.error(f"テキスト生成失敗: {result['error']}")
                return GenerateText(error=result["error"])

            logger.info("テキスト生成成功")
            return GenerateText(
                theme=result["theme"],
                category=result["category"],
                pairs=[TextPairType(**pair) for pair in result["pairs"]],
            )
        except Exception as e:
            logger.error(f"テキスト生成ミューテーションエラー: {str(e)}", exc_info=True)
            return GenerateText(
                error=f"{TextGeneratorErrorMessages.TEXT_GENERATION_ERROR}: {str(e)}"
            )
