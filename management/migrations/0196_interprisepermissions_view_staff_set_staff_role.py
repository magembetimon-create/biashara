from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0195_stokadjustment_recon'),
    ]

    operations = [
        migrations.AddField(
            model_name='interprisepermissions',
            name='view_staff',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='interprisepermissions',
            name='set_staff_role',
            field=models.BooleanField(default=False),
        ),
    ]
