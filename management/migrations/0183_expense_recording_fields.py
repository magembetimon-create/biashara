from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0182_alter_customer_interprise_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='matumizi',
            name='attach_receipt',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='bidhaa_matumizi',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='bill_amount',
            field=models.DecimalField(blank=True, decimal_places=4, max_digits=20, null=True),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='bill_fixed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='bili',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='discount',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='for_supplies',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='posho',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='rekodimatumizi',
            name='expense_kind',
            field=models.CharField(blank=True, default='', max_length=40),
        ),
        migrations.AddField(
            model_name='rekodimatumizi',
            name='kabidhiwa',
            field=models.CharField(blank=True, default='', max_length=500),
        ),
        migrations.AddField(
            model_name='rekodimatumizi',
            name='tin_number',
            field=models.CharField(blank=True, default='', max_length=50),
        ),
        migrations.AddField(
            model_name='rekodimatumizi',
            name='worker_recipient',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='management.workers'),
        ),
    ]
