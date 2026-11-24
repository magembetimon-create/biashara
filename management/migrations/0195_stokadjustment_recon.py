from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0194_waiter_clearing_owed_remaining'),
    ]

    operations = [
        migrations.AddField(
            model_name='stokadjustment',
            name='recon',
            field=models.BooleanField(default=False),
        ),
    ]
