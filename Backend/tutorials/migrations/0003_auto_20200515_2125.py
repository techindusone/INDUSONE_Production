# Generated by Django 3.0.4 on 2020-05-15 15:55

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tutorials', '0002_auto_20200515_2123'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tutorial',
            name='createdDate',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
        migrations.AlterField(
            model_name='tutorial',
            name='updatedDate',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]