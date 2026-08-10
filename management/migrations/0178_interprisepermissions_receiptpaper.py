from django.db import migrations, models


def migrate_mnrecipt_to_receipt_paper(apps, schema_editor):
    InterprisePermissions = apps.get_model('management', 'InterprisePermissions')
    for row in InterprisePermissions.objects.filter(mnRecipt=True):
        row.receiptPaper = 1
        row.save(update_fields=['receiptPaper'])


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0177_alter_bidhaa_mahi_nullable'),
    ]

    operations = [
        migrations.AddField(
            model_name='interprisepermissions',
            name='receiptPaper',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.RunPython(migrate_mnrecipt_to_receipt_paper, migrations.RunPython.noop),
    ]
