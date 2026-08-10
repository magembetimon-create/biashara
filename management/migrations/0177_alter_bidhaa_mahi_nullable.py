from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0176_alter_bidhaa_bidhaa_aina_alter_bidhaa_kampuni'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bidhaa',
            name='Mahi',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to='management.mahitaji',
            ),
        ),
    ]
