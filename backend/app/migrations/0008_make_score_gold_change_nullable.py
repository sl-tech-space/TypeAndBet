from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0007_rename_bet_amount_and_gold_change"),
    ]

    operations = [
        migrations.AlterField(
            model_name="game",
            name="score_gold_change",
            field=models.IntegerField(null=True, blank=True),
        ),
    ]
