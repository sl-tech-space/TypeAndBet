import logging
import random

import graphene
import MeCab
from django.db import transaction
from django.db.models import Min, Max

from app.models.game import TextPair

logger = logging.getLogger("app")


def _get_random_converted_text_pair():
    """IDレンジからランダムに1件取得（ORDER BY ? を回避）。
    稀に欠番があるため複数回試行し、見つからない場合は先頭/最後尾にフォールバック。
    """
    agg = TextPair.objects.filter(is_converted=True).aggregate(
        min_id=Min("id"), max_id=Max("id")
    )
    min_id = agg.get("min_id")
    max_id = agg.get("max_id")
    if min_id is None or max_id is None:
        return None

    for _ in range(5):
        candidate = random.randint(min_id, max_id)
        obj = (
            TextPair.objects.filter(is_converted=True, id__gte=candidate)
            .order_by("id")
            .first()
        )
        if obj:
            return obj

    # フォールバック（先頭/最後尾）
    obj = TextPair.objects.filter(is_converted=True).order_by("id").first()
    if obj:
        return obj
    return TextPair.objects.filter(is_converted=True).order_by("-id").first()


class TextPairType(graphene.ObjectType):
    """TextPairのGraphQL型定義"""

    id = graphene.Int()
    kanji = graphene.String()
    hiragana = graphene.String()


class GetRandomTextPair(graphene.Mutation):
    """変換フラグがtrueであるレコードをランダムに選出し、kanji、hiraganaのペアを取得するミューテーション"""

    class Arguments:
        pass  # 引数なし

    text_pair = graphene.Field(TextPairType)
    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info):
        logger.info("ランダムTextPairペア取得開始")
        try:
            # 変換済み（is_converted=True）のレコードからランダムに1つ選出（高効率）
            text_pair = _get_random_converted_text_pair()

            if not text_pair:
                logger.warning("変換済みのTextPairが見つかりませんでした")
                return GetRandomTextPair(
                    text_pair=None,
                    success=False,
                )

            logger.info(f"ランダムTextPairペア取得完了: id={text_pair.id}")
            return GetRandomTextPair(
                text_pair=TextPairType(
                    id=text_pair.id,
                    kanji=text_pair.kanji,
                    hiragana=text_pair.hiragana,
                ),
                success=True,
            )

        except Exception as e:
            logger.error(f"ランダムTextPairペア取得エラー: {str(e)}", exc_info=True)
            return GetRandomTextPair(
                text_pair=None,
                success=False,
            )


class ConvertToHiragana(graphene.Mutation):
    """未変換の漢字文章をひらがなに変換するミューテーション"""

    class Arguments:
        pass

    success = graphene.Boolean()
    converted_count = graphene.Int()

    @classmethod
    def _katakana_to_hiragana(cls, katakana_text):
        """カタカナをひらがなに変換するヘルパーメソッド"""
        hiragana_text = ""
        for char in katakana_text:
            if "ァ" <= char <= "ヶ":
                # カタカナをひらがなに変換
                hiragana_text += chr(ord(char) - ord("ァ") + ord("ぁ"))
            else:
                hiragana_text += char
        return hiragana_text

    @classmethod
    def mutate(cls, root, info):
        logger.info("ひらがな変換開始")
        try:
            # MeCabの初期化（複数の設定を試行）
            mecab = None
            mecab_available = False

            for tagger_option in [
                "",
                "-Owakati",
                "-d /usr/lib/mecab/dic/ipadic",
                "-d /var/lib/mecab/dic/ipadic",
            ]:
                try:
                    logger.info(f"MeCab初期化試行: {tagger_option or 'デフォルト'}")
                    mecab = MeCab.Tagger(tagger_option)
                    mecab_available = True
                    logger.info(f"MeCab初期化成功: {tagger_option or 'デフォルト'}")
                    break
                except RuntimeError as e:
                    logger.warning(
                        f"MeCab初期化失敗: {tagger_option or 'デフォルト'} - {str(e)}"
                    )
                    continue

            if not mecab_available:
                logger.error("MeCabの初期化に失敗しました。")
                return ConvertToHiragana(
                    success=False,
                    converted_count=0,
                )

            # 未変換の文章を取得
            unconverted_pairs = TextPair.objects.filter(is_converted=False)
            converted_count = 0

            with transaction.atomic():
                for text_pair in unconverted_pairs:
                    try:
                        # MeCabで形態素解析
                        parsed = mecab.parse(text_pair.kanji)
                        lines = parsed.strip().split("\n")

                        # ひらがな部分を抽出
                        hiragana_parts = []
                        for line in lines:
                            if line == "EOS" or not line.strip():
                                break
                            parts = line.split("\t")
                            if len(parts) >= 2:
                                # 表層形（単語）
                                surface = parts[0]
                                # 品詞情報をカンマで分割
                                features = parts[1].split(",")

                                # 読み仮名はカンマ区切りの8番目（インデックス7）
                                if len(features) >= 8 and features[7] != "*":
                                    # カタカナをひらがなに変換
                                    katakana_reading = features[7]
                                    hiragana_reading = cls._katakana_to_hiragana(
                                        katakana_reading
                                    )
                                    hiragana_parts.append(hiragana_reading)
                                else:
                                    # 読み仮名がない場合は表層形をそのまま使用
                                    hiragana_parts.append(surface)

                        # ひらがな文章を作成
                        hiragana_text = "".join(hiragana_parts)

                        # データベースを更新
                        text_pair.hiragana = hiragana_text
                        text_pair.is_converted = True
                        text_pair.save()

                        converted_count += 1
                        logger.info(
                            f"変換完了: id={text_pair.id}, kanji_len={len(text_pair.kanji)}, hiragana_len={len(hiragana_text)}"
                        )

                    except Exception as e:
                        logger.error(f"個別変換エラー (ID: {text_pair.id}): {str(e)}")
                        continue

            logger.info(f"ひらがな変換完了: {converted_count}件変換")
            return ConvertToHiragana(
                success=True,
                converted_count=converted_count,
            )

        except Exception as e:
            logger.error(f"ひらがな変換エラー: {str(e)}", exc_info=True)
            return ConvertToHiragana(
                success=False,
                converted_count=0,
            )


class GetTextPairsType(graphene.ObjectType):
    """TextPairの一覧取得結果を表すGraphQL型定義"""

    text_pairs = graphene.List(TextPairType)
    total_count = graphene.Int()
    success = graphene.Boolean()
    message = graphene.String()


def resolve_get_text_pairs(root, info, limit=10, offset=0, converted_only=False):
    logger.info(
        f"TextPair取得開始: limit={limit}, offset={offset}, converted_only={converted_only}"
    )
    try:
        queryset = TextPair.objects.all()

        if converted_only:
            queryset = queryset.filter(is_converted=True)

        total_count = queryset.count()
        text_pairs = queryset.order_by("-created_at")[offset : offset + limit]

        logger.info(f"TextPair取得完了: {len(text_pairs)}件取得")
        return GetTextPairsType(
            text_pairs=[
                TextPairType(
                    id=pair.id,
                    kanji=pair.kanji,
                    hiragana=pair.hiragana,
                    is_converted=pair.is_converted,
                    created_at=pair.created_at,
                    updated_at=pair.updated_at,
                )
                for pair in text_pairs
            ],
            total_count=total_count,
            success=True,
            message="正常に取得しました",
        )

    except Exception as e:
        logger.error(f"TextPair取得エラー: {str(e)}", exc_info=True)
        return GetTextPairsType(
            text_pairs=[],
            total_count=0,
            success=False,
            message=f"取得に失敗しました: {str(e)}",
        )


class GetConvertedTextPairsType(graphene.ObjectType):
    """変換済みTextPairの取得結果を表すGraphQL型定義"""

    text_pairs = graphene.List(TextPairType)
    total_count = graphene.Int()
    success = graphene.Boolean()
    message = graphene.String()


def resolve_get_converted_text_pairs(root, info, limit=10, offset=0, random=False):
    logger.info(
        f"変換済みTextPair取得開始: limit={limit}, offset={offset}, random={random}"
    )
    try:
        # 変換済みのペアのみを取得
        queryset = TextPair.objects.filter(is_converted=True)
        total_count = queryset.count()

        if random:
            # ランダム選出の場合（ORDER BY ? を避け、ランダム開始位置から連続取得）
            if total_count == 0:
                text_pairs = []
            else:
                start = random.randint(0, max(0, total_count - 1))
                # ラップアラウンド取得
                first_chunk = list(queryset.order_by("id")[start : start + limit])
                if len(first_chunk) < limit and start > 0:
                    remaining = limit - len(first_chunk)
                    second_chunk = list(queryset.order_by("id")[:remaining])
                    text_pairs = first_chunk + second_chunk
                else:
                    text_pairs = first_chunk
            logger.info(f"ランダム選出でTextPair取得完了: {len(text_pairs)}件取得")
        else:
            # 通常の日時順の場合
            text_pairs = queryset.order_by("-created_at")[offset : offset + limit]
            logger.info(f"変換済みTextPair取得完了: {len(text_pairs)}件取得")

        return GetConvertedTextPairsType(
            text_pairs=[
                TextPairType(
                    id=pair.id,
                    kanji=pair.kanji,
                    hiragana=pair.hiragana,
                    is_converted=pair.is_converted,
                    created_at=pair.created_at,
                    updated_at=pair.updated_at,
                )
                for pair in text_pairs
            ],
            total_count=total_count,
            success=True,
            message="正常に取得しました",
        )

    except Exception as e:
        logger.error(f"変換済みTextPair取得エラー: {str(e)}", exc_info=True)
        return GetConvertedTextPairsType(
            text_pairs=[],
            total_count=0,
            success=False,
            message=f"取得に失敗しました: {str(e)}",
        )


class GetRandomTextPairType(graphene.ObjectType):
    """ランダムTextPair取得結果を表すGraphQL型定義"""

    text_pair = graphene.Field(TextPairType)
    success = graphene.Boolean()
    message = graphene.String()


def resolve_get_random_text_pair(root, info):
    logger.info("ランダムTextPair選出開始")
    try:
        # 変換済み（is_converted=True）のレコードからランダムに1つ選出（高効率）
        text_pair = _get_random_converted_text_pair()

        if not text_pair:
            logger.warning("変換済みのTextPairが見つかりませんでした")
            return GetRandomTextPairType(
                text_pair=None,
                success=False,
                message="変換済みの文章ペアが見つかりませんでした",
            )

        logger.info(f"ランダムTextPair選出完了: ID={text_pair.id}")
        return GetRandomTextPairType(
            text_pair=TextPairType(
                id=text_pair.id,
                kanji=text_pair.kanji,
                hiragana=text_pair.hiragana,
                is_converted=text_pair.is_converted,
                created_at=text_pair.created_at,
                updated_at=text_pair.updated_at,
            ),
            success=True,
            message="正常に取得しました",
        )

    except Exception as e:
        logger.error(f"ランダムTextPair選出エラー: {str(e)}", exc_info=True)
        return GetRandomTextPairType(
            text_pair=None,
            success=False,
            message=f"取得に失敗しました: {str(e)}",
        )
