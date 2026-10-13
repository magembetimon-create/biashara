from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0192_interprise_waiter_service_cutover'),
    ]

    operations = [
        migrations.AddField(
            model_name='bei_za_bidhaa',
            name='bei_kununua',
            field=models.DecimalField(decimal_places=10, default=0, max_digits=20),
        ),
    ]
