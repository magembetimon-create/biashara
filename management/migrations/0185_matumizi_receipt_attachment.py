from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0184_expense_tax_group'),
    ]

    operations = [
        migrations.CreateModel(
            name='MatumiziReceiptAttachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='matumizi_receipts/%Y/%m/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('Interprise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='management.interprise')),
                ('manunuzi', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='receipt_attachments', to='management.manunuzi')),
                ('rekodi_matumizi', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='receipt_attachments', to='management.rekodimatumizi')),
                ('uploaded_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='management.interprisepermissions')),
            ],
            options={
                'verbose_name_plural': 'Matumizi receipt attachments',
            },
        ),
    ]
