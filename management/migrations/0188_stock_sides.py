from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0187_picha_yenyewe_vision_terms'),
    ]

    operations = [
        migrations.CreateModel(
            name='stock_side',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('sort', models.IntegerField(default=0)),
                ('Interprise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='management.interprise')),
                ('aina', models.ManyToManyField(blank=True, related_name='stock_sides', to='management.bidhaa_aina')),
            ],
        ),
        migrations.CreateModel(
            name='stock_row',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('sort', models.IntegerField(default=0)),
                ('side', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rows', to='management.stock_side')),
            ],
        ),
        migrations.CreateModel(
            name='stock_column',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('sort', models.IntegerField(default=0)),
                ('side', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='columns', to='management.stock_side')),
            ],
        ),
        migrations.CreateModel(
            name='stock_item_place',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Interprise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='management.interprise')),
                ('bidhaa', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='management.bidhaa')),
                ('column', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='management.stock_column')),
                ('row', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='management.stock_row')),
                ('side', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='management.stock_side')),
            ],
            options={
                'unique_together': {('Interprise', 'bidhaa')},
            },
        ),
    ]
