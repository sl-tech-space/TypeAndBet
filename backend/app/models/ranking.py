from django.db import models
import uuid
from .user import User

class Ranking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ranking = models.IntegerField(null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rankings', null=False)
    score = models.IntegerField(null=False)
    gold = models.IntegerField(default=1000, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'rankings'
        ordering = ['ranking']
        unique_together = ['user']

    def __str__(self):
        return f"{self.user.name}'s ranking: {self.ranking}"

    def save(self, *args, **kwargs):
        # scoreのチェック
        if self.score < 0:
            raise ValueError("Score must be greater than or equal to 0")
        super().save(*args, **kwargs) 