from django.db import migrations


def mark_existing_weka_approved(apps, schema_editor):
    wekaCash = apps.get_model('management', 'wekaCash')
    wekaCash.objects.update(admin_approve=True)


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0190_notification_hub_approvals'),
    ]

    operations = [
        migrations.RunPython(mark_existing_weka_approved, migrations.RunPython.noop),
    ]
