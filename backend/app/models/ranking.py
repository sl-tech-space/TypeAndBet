import uuid

from django.db import models


class Ranking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ranking = models.IntegerField(null=False)
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="rankings", null=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rankings"
        ordering = ["ranking"]
        unique_together = ["user"]
