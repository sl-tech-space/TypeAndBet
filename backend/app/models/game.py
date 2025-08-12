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
        constraints = [
            models.CheckConstraint(
                check=models.Q(bet_gold__gte=100) & models.Q(bet_gold__lte=700),
                name="bet_gold_between_100_700",
            ),
            models.CheckConstraint(
                check=models.Q(score__gte=0), name="score_non_negative"
            ),
            models.CheckConstraint(
                check=models.Q(before_bet_gold__gte=0),
                name="before_bet_gold_non_negative",
            ),
            models.CheckConstraint(
                check=models.Q(result_gold__gte=0), name="result_gold_non_negative"
            ),
        ]
        indexes = [
            models.Index(fields=["user", "created_at"], name="idx_game_user_created"),
            models.Index(fields=["created_at"], name="idx_game_created"),
        ]


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
        indexes = [
            models.Index(fields=["is_converted"], name="idx_textpair_converted"),
            models.Index(fields=["created_at"], name="idx_textpair_created"),
        ]

    def __str__(self):
        return f"TextPair {self.id}: {self.kanji[:20]}..."
