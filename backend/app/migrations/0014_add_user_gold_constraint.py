# Generated manually for adding user gold constraint

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0013_alter_user_managers_and_more"),
    ]

    operations = [
        migrations.AddConstraint(
            model_name="user",
            constraint=models.CheckConstraint(
                check=models.Q(gold__gte=0), name="gold_non_negative"
            ),
        ),
    ]
