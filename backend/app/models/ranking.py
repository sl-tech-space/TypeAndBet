import uuid

from django.db import models


class Ranking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ranking = models.IntegerField(null=False)
    # 1ユーザーに1レコードであることを明示
    user = models.OneToOneField(
        "User", on_delete=models.CASCADE, related_name="ranking", null=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rankings"
        ordering = ["ranking"]
        indexes = [
            models.Index(fields=["ranking"], name="idx_ranking_rank"),
        ]
