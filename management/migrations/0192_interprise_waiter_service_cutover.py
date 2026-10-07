import datetime

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0191_mark_existing_weka_approved'),
    ]

    operations = [
        migrations.AddField(
            model_name='interprise',
            name='waiter_service_cutover',
            field=models.TimeField(default=datetime.time(0, 0)),
        ),
    ]
