from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0008_make_score_gold_change_nullable"),
    ]

    operations = [
        migrations.RenameField(
            model_name="game",
            old_name="after_bet_gold",
            new_name="result_gold",
        ),
    ]


