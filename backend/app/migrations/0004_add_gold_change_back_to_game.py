from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0003_partition_textpairs"),
    ]

    operations = [
        migrations.AddField(
            model_name="game",
            name="gold_change",
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]


