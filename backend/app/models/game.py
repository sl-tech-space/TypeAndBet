from django.db import models
import uuid
from .user import User

class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games', null=False)
    bet_amount = models.IntegerField(null=False)
    score = models.IntegerField(null=False)
    gold_change = models.IntegerField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'games'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.name}'s game at {self.created_at}"

    def save(self, *args, **kwargs):
        # bet_amountのチェック
        if self.bet_amount < 100:
            raise ValueError("Bet amount must be greater than or equal to 100")
        # scoreのチェック
        if self.score < 0:
            raise ValueError("Score must be greater than or equal to 0")
        super().save(*args, **kwargs) 