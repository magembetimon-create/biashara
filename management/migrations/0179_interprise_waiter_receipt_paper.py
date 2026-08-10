from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0178_interprisepermissions_receiptpaper'),
    ]

    operations = [
        migrations.AddField(
            model_name='interprise',
            name='waiter_receipt_paper',
            field=models.PositiveSmallIntegerField(default=1),
        ),
    ]
