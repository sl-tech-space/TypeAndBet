from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid
from django.contrib.auth.hashers import make_password, check_password
from .ranking import Ranking

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=15, unique=True, null=False)
    email = models.EmailField(max_length=254, unique=True, null=False)
    icon = models.CharField(max_length=255, null=False, default='default.png')
    gold = models.IntegerField(default=1000, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    username = None
    first_name = None
    last_name = None
    groups = None
    user_permissions = None
    last_login = None
    is_superuser = None
    is_staff = None
    date_joined = None

    def __str__(self):
        return self.name

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        
        if is_new:
            Ranking.objects.create(user=self, ranking=1)
            self.update_rankings()

    @classmethod
    def update_rankings(cls):
        """全ユーザーのランキングを更新"""
        users = cls.objects.all().order_by('-gold')
        for index, user in enumerate(users):
            Ranking.objects.filter(user=user).update(ranking=index + 1)

    class Meta:
        db_table = 'users'
        ordering = ["id"]