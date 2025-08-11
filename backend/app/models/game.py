import uuid

from django.db import models

from .user import User


class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="games", null=False
    )
    bet_gold = models.IntegerField(null=False)
    score = models.IntegerField(null=False)
    score_gold_change = models.IntegerField(null=True, blank=True)
    before_bet_gold = models.IntegerField(null=True, blank=True)
    result_gold = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "games"


class TextPair(models.Model):
    """漢字文章とひらがな文章のペアモデル"""

    kanji = models.TextField(verbose_name="漢字文章")
    hiragana = models.TextField(blank=True, null=True, verbose_name="ひらがな文章")
    is_converted = models.BooleanField(default=False, verbose_name="ひらがな変換フラグ")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "text_pairs"
        verbose_name = "文章ペア"
        verbose_name_plural = "文章ペア"

    def __str__(self):
        return f"TextPair {self.id}: {self.kanji[:20]}..."
