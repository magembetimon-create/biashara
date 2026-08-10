from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0180_customer_interprise'),
    ]

    operations = [
        migrations.AddField(
            model_name='workers',
            name='tin',
            field=models.CharField(blank=True, default='', max_length=50),
        ),
    ]
