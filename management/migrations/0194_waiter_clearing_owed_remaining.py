from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0193_bei_za_bidhaa_bei_kununua'),
    ]

    operations = [
        migrations.AddField(
            model_name='waiter_clearing',
            name='owed_amount',
            field=models.DecimalField(blank=True, decimal_places=4, max_digits=20, null=True),
        ),
        migrations.AddField(
            model_name='waiter_clearing',
            name='remaining_amount',
            field=models.DecimalField(blank=True, decimal_places=4, max_digits=20, null=True),
        ),
    ]
