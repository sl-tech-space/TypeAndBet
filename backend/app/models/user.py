import uuid

from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models

from .managers import UserManager
from .ranking import Ranking


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=15, unique=True, null=False)
    email = models.EmailField(max_length=254, unique=True, null=False)
    icon = models.CharField(max_length=255, null=False, default="default.png")
    gold = models.IntegerField(default=1000, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new:
            Ranking.objects.create(user=self, ranking=1)

    @classmethod
    def update_rankings(cls):
        """全ユーザーのランキングを更新"""
        users = cls.objects.all().order_by("-gold")
        for index, user in enumerate(users):
            Ranking.objects.filter(user=user).update(ranking=index + 1)

    class Meta:
        db_table = "users"
        ordering = ["id"]
        constraints = [
            models.UniqueConstraint(
                fields=["email"],
                condition=models.Q(is_active=True),
                name="unique_active_email",
            ),
        ]
