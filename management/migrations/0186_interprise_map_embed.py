from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0185_matumizi_receipt_attachment'),
    ]

    operations = [
        migrations.AddField(
            model_name='interprise',
            name='map_embed',
            field=models.TextField(blank=True, null=True),
        ),
    ]
