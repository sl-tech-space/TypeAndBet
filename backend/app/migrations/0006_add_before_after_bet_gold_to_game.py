from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0005_remove_game_accuracy_remove_game_is_winner_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="game",
            name="before_bet_gold",
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name="game",
            name="after_bet_gold",
            field=models.IntegerField(null=True, blank=True),
        ),
    ]


