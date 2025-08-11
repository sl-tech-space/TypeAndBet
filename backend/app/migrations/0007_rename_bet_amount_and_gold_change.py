from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0006_add_before_after_bet_gold_to_game"),
    ]

    operations = [
        migrations.RenameField(
            model_name="game",
            old_name="bet_amount",
            new_name="bet_gold",
        ),
        migrations.RenameField(
            model_name="game",
            old_name="gold_change",
            new_name="score_gold_change",
        ),
    ]
