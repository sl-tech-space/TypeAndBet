from django.conf import settings
from django.db import migrations, models
import hashlib


def forwards_populate_token_hash(apps, schema_editor):
    EmailVerification = apps.get_model("app", "EmailVerification")
    PasswordReset = apps.get_model("app", "PasswordReset")

    secret = getattr(settings, "SECRET_KEY", "")

    # EmailVerification: token -> token_hash
    for ev in EmailVerification.objects.all().only(
        "id"
    ):  # iterate ids to avoid loading large fields
        ev_obj = EmailVerification.objects.get(id=ev.id)
        # if legacy 'token' column exists (pre-migration state), fetch via __dict__ safely
        legacy_token = getattr(ev_obj, "token", None)
        if legacy_token and not getattr(ev_obj, "token_hash", None):
            ev_obj.token_hash = hashlib.sha256(
                (legacy_token + secret).encode("utf-8")
            ).hexdigest()
            ev_obj.save(update_fields=["token_hash"])

    # PasswordReset: token -> token_hash
    for pr in PasswordReset.objects.all().only("id"):
        pr_obj = PasswordReset.objects.get(id=pr.id)
        legacy_token = getattr(pr_obj, "token", None)
        if legacy_token and not getattr(pr_obj, "token_hash", None):
            pr_obj.token_hash = hashlib.sha256(
                (legacy_token + secret).encode("utf-8")
            ).hexdigest()
            pr_obj.save(update_fields=["token_hash"])


def backwards_noop(apps, schema_editor):
    # 逆方向は対応しない（ハッシュから平文は復元不可）
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0011_passwordreset"),
    ]

    operations = [
        # 1) 先に nullable で token_hash を追加
        migrations.AddField(
            model_name="emailverification",
            name="token_hash",
            field=models.CharField(max_length=64, null=True, unique=False),
        ),
        migrations.AddField(
            model_name="passwordreset",
            name="token_hash",
            field=models.CharField(max_length=64, null=True, unique=False),
        ),
        # 2) 既存データを token -> token_hash に移行
        migrations.RunPython(forwards_populate_token_hash, backwards_noop),
        # 3) 制約を厳格化（NOT NULL + UNIQUE）
        migrations.AlterField(
            model_name="emailverification",
            name="token_hash",
            field=models.CharField(max_length=64, null=False, unique=True),
        ),
        migrations.AlterField(
            model_name="passwordreset",
            name="token_hash",
            field=models.CharField(max_length=64, null=False, unique=True),
        ),
        # 4) 旧 token カラムを削除
        migrations.RemoveField(
            model_name="emailverification",
            name="token",
        ),
        migrations.RemoveField(
            model_name="passwordreset",
            name="token",
        ),
        # 5) インデックス（必要に応じて）
        migrations.AddIndex(
            model_name="emailverification",
            index=models.Index(fields=["token_hash"], name="idx_emailverif_tokenhash"),
        ),
        migrations.AddIndex(
            model_name="emailverification",
            index=models.Index(fields=["expires_at"], name="idx_emailverif_expires"),
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
    ]
