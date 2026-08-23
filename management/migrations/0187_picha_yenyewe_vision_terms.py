from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0186_interprise_map_embed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='picha_yenyewe',
            name='picha_hash',
            field=models.TextField(blank=True, null=True),
        ),
    ]
