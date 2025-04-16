from django.db import models
import uuid

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=15, unique=True, null=False)
    icon = models.CharField(max_length=255, null=False)
    email = models.EmailField(max_length=254, unique=True, null=False)
    password = models.CharField(max_length=255, null=False)
    gold = models.IntegerField(default=1000, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']