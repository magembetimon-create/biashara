from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0183_expense_recording_fields'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExpenseTaxGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('desc', models.TextField(blank=True)),
                ('rate', models.DecimalField(decimal_places=4, default=0, max_digits=10)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='auth.user')),
            ],
            options={
                'verbose_name_plural': 'Expense tax groups',
            },
        ),
        migrations.AddField(
            model_name='matumizi',
            name='bill_daily',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='bill_duration',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='bill_last_paid',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='bill_monthly',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='bill_weekly',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='bill_yearly',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='matumizi',
            name='tax_group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='management.expensetaxgroup'),
        ),
        migrations.AddField(
            model_name='rekodimatumizi',
            name='tax_group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='management.expensetaxgroup'),
        ),
    ]
