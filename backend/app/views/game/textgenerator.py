import yaml
import random
import google.generativeai as genai
from pathlib import Path
import graphene
from django.conf import settings

class TextGenerator:
    def __init__(self, api_key=None):
        """TextGeneratorの初期化"""
        api_key = api_key or settings.GEMINI_API_KEY
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        
        # 設定ファイルの読み込み
        base_path = Path(__file__).parent.parent.parent / 'text_generation'
        with open(base_path / 'themes.yaml', 'r', encoding='utf-8') as f:
            self.theme_categories = yaml.safe_load(f)
        with open(base_path / 'prompts.yaml', 'r', encoding='utf-8') as f:
            self.prompts = yaml.safe_load(f)

    def _get_random_theme(self):
        """ランダムなカテゴリーからランダムなテーマを選択"""
        category = random.choice(list(self.theme_categories.keys()))
        theme = random.choice(self.theme_categories[category])
        return theme, category

    def _generate_prompt(self, theme, category=None):
        """タイピング用のプロンプトを生成する"""
        category_info = f"（カテゴリー: {category}）" if category else ""
        return self.prompts['typing_prompt'].format(
            theme=theme,
            category_info=category_info
        )

    def generate_text(self):
        """ランダムなテーマでテキストを生成する"""
        # ランダムなテーマとカテゴリーを選択
        theme, category = self._get_random_theme()
        
        # プロンプトを生成
        prompt = self._generate_prompt(theme, category)
        
        try:
            # AIにリクエストを送る
            response = self.model.generate_content(prompt)
            generated_text = response.text

            # 生成されたテキストを整形
            parts = generated_text.split("。")
            kanji_hiragana_pairs = []

            for i in range(0, len(parts) - 1, 2):
                if i + 1 >= len(parts):
                    break
                    
                kanji_text = parts[i].strip()
                hiragana_text = parts[i + 1].strip()
                
                # 空のペアはスキップ
                if kanji_text and hiragana_text:
                    kanji_hiragana_pairs.append({
                        "kanji": kanji_text,
                        "hiragana": hiragana_text
                    })

            return {
                "theme": theme,
                "category": category,
                "pairs": kanji_hiragana_pairs
            }

        except Exception as e:
            return {
                "error": f"テキスト生成エラー: {str(e)}"
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
        try:
            generator = TextGenerator()
            result = generator.generate_text()
            
            if "error" in result:
                return GenerateText(error=result["error"])
            
            return GenerateText(
                theme=result["theme"],
                category=result["category"],
                pairs=[TextPairType(**pair) for pair in result["pairs"]]
            )
        except Exception as e:
            return GenerateText(error=f"テキスト生成エラー: {str(e)}")