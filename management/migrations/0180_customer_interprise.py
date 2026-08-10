from django.db import migrations, models
import django.db.models.deletion


def backfill_customer_branches(apps, schema_editor):
    Wateja = apps.get_model('management', 'wateja')
    CustomerInterprise = apps.get_model('management', 'customer_Interprise')
    for row in Wateja.objects.exclude(Interprise_id=None).iterator():
        CustomerInterprise.objects.get_or_create(mteja_id=row.id, branch_id=row.Interprise_id)


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0179_interprise_waiter_receipt_paper'),
    ]

    operations = [
        migrations.CreateModel(
            name='customer_Interprise',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('branch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customer_branch_links', to='management.interprise')),
                ('mteja', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customer_interprise_links', to='management.wateja')),
            ],
            options={
                'unique_together': {('mteja', 'branch')},
            },
        ),
        migrations.RunPython(backfill_customer_branches, migrations.RunPython.noop),
    ]
