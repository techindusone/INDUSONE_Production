# Generated by Django 3.0.4 on 2020-05-15 07:02

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tutorial',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=255)),
                ('content', models.TextField(default='')),
                ('createdDate', models.DateTimeField(default=datetime.datetime(2020, 5, 15, 12, 32, 7, 158883))),
                ('updatedDate', models.DateTimeField(default=datetime.datetime(2020, 5, 15, 12, 32, 7, 158883))),
            ],
        ),
    ]