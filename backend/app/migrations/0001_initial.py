# Generated manually - Consolidated migration for current model state
# This migration reflects the current state of all models including all changes from 0002 and 0003
# All previous migrations (0002, 0003) have been consolidated into this single file

import uuid

import django.contrib.auth.models
import django.db.models.deletion
from django.db import migrations, models

import app.models.managers


class Migration(migrations.Migration):
    initial = True
    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        # User model - Current state (including all changes from 0002 and 0003)
        migrations.CreateModel(
            name="User",
            fields=[
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4, editable=False, primary_key=True
                    ),
                ),
                ("name", models.CharField(max_length=15, unique=True)),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("icon", models.CharField(default="default.png", max_length=255)),
                ("gold", models.IntegerField(default=1000, null=True)),
                ("is_active", models.BooleanField(default=True)),
                ("is_staff", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                # groups and user_permissions will be added in a separate migration
                # after auth app migrations are applied
            ],
            managers=[
                ("objects", app.models.managers.UserManager()),
            ],
        ),
        # Game model - Current state (including all changes from 0002 and 0003)
        migrations.CreateModel(
            name="Game",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4, editable=False, primary_key=True
                    ),
                ),
                ("bet_gold", models.IntegerField()),
                ("score", models.IntegerField()),
                ("score_gold_change", models.IntegerField(blank=True, null=True)),
                ("before_bet_gold", models.IntegerField(blank=True, null=True)),
                ("result_gold", models.IntegerField(blank=True, null=True)),
                (
                    "idempotency_key",
                    models.CharField(
                        blank=True, max_length=255, null=True, unique=True
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="games",
                        to="app.user",
                    ),
                ),
            ],
            options={
                "db_table": "games",
            },
        ),
        # TextPair model - Current state (including all changes from 0002 and 0003)
        migrations.CreateModel(
            name="TextPair",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("kanji", models.TextField(verbose_name="漢字文章")),
                (
                    "hiragana",
                    models.TextField(
                        blank=True, null=True, verbose_name="ひらがな文章"
                    ),
                ),
                (
                    "is_converted",
                    models.BooleanField(
                        default=False, verbose_name="ひらがな変換フラグ"
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "text_pairs",
                "verbose_name": "文章ペア",
                "verbose_name_plural": "文章ペア",
            },
        ),
        # Ranking model - Current state (including all changes from 0002 and 0003)
        migrations.CreateModel(
            name="Ranking",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4, editable=False, primary_key=True
                    ),
                ),
                ("ranking", models.IntegerField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ranking",
                        to="app.user",
                    ),
                ),
            ],
            options={
                "db_table": "rankings",
                "ordering": ["ranking"],
            },
        ),
        # EmailVerification model - Current state (including all changes from 0002 and 0003)
        migrations.CreateModel(
            name="EmailVerification",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4, editable=False, primary_key=True
                    ),
                ),
                ("token_hash", models.CharField(max_length=64, unique=True)),
                ("expires_at", models.DateTimeField()),
                ("is_verified", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("verified_at", models.DateTimeField(blank=True, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="email_verifications",
                        to="app.user",
                    ),
                ),
            ],
            options={
                "db_table": "email_verifications",
                "ordering": ["-created_at"],
            },
        ),
        # PasswordReset model - Current state (including all changes from 0002 and 0003)
        migrations.CreateModel(
            name="PasswordReset",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4, editable=False, primary_key=True
                    ),
                ),
                ("token_hash", models.CharField(max_length=64, unique=True)),
                ("expires_at", models.DateTimeField()),
                ("is_used", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("used_at", models.DateTimeField(blank=True, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="password_resets",
                        to="app.user",
                    ),
                ),
            ],
            options={
                "db_table": "password_resets",
                "ordering": ["-created_at"],
            },
        ),
        # Constraints
        migrations.AddConstraint(
            model_name="game",
            constraint=models.CheckConstraint(
                check=models.Q(("bet_gold__gte", 100))
                & models.Q(("bet_gold__lte", 700)),
                name="bet_gold_between_100_700",
            ),
        ),
        migrations.AddConstraint(
            model_name="game",
            constraint=models.CheckConstraint(
                check=models.Q(("score__gte", 0)), name="score_non_negative"
            ),
        ),
        migrations.AddConstraint(
            model_name="game",
            constraint=models.CheckConstraint(
                check=models.Q(("before_bet_gold__gte", 0)),
                name="before_bet_gold_non_negative",
            ),
        ),
        migrations.AddConstraint(
            model_name="game",
            constraint=models.CheckConstraint(
                check=models.Q(("result_gold__gte", 0)), name="result_gold_non_negative"
            ),
        ),
        # Indexes
        migrations.AddIndex(
            model_name="game",
            index=models.Index(
                fields=["user", "created_at"], name="idx_game_user_created"
            ),
        ),
        migrations.AddIndex(
            model_name="game",
            index=models.Index(fields=["created_at"], name="idx_game_created"),
        ),
        migrations.AddIndex(
            model_name="game",
            index=models.Index(fields=["idempotency_key"], name="idx_game_idempotency"),
        ),
        migrations.AddIndex(
            model_name="ranking",
            index=models.Index(fields=["ranking"], name="idx_ranking_rank"),
        ),
        migrations.AddIndex(
            model_name="emailverification",
            index=models.Index(fields=["token_hash"], name="idx_emailverif_tokenhash"),
        ),
        migrations.AddIndex(
            model_name="emailverification",
            index=models.Index(fields=["expires_at"], name="idx_emailverif_expires"),
        ),
        migrations.AddIndex(
            model_name="emailverification",
            index=models.Index(
                fields=["user", "is_verified"], name="email_verif_user_id_87ed91_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="passwordreset",
            index=models.Index(
                fields=["token_hash"], name="idx_passwordreset_tokenhash"
            ),
        ),
        migrations.AddIndex(
            model_name="passwordreset",
            index=models.Index(fields=["expires_at"], name="idx_passwordreset_expires"),
        ),
        migrations.AddIndex(
            model_name="passwordreset",
            index=models.Index(
                fields=["user", "is_used"], name="password_re_user_id_643415_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="textpair",
            index=models.Index(fields=["is_converted"], name="idx_textpair_converted"),
        ),
        migrations.AddIndex(
            model_name="textpair",
            index=models.Index(fields=["created_at"], name="idx_textpair_created"),
        ),
    ]
