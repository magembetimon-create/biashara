from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0172_bidhaa_stoku_is_grouped_item_grouped_item_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='bidhaa_stoku',
            name='grouped_item_qty_sold',
            field=models.DecimalField(decimal_places=4, default=0, max_digits=20),
        ),
        migrations.AddField(
            model_name='bidhaa_stoku',
            name='partial_item_reduction_qty',
            field=models.DecimalField(decimal_places=4, default=0, max_digits=20),
        ),
    ]
