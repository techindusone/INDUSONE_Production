# Generated by Django 3.0.4 on 2020-05-27 10:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('problemStatements', '0006_auto_20200517_2006'),
    ]

    operations = [
        migrations.RenameField(
            model_name='submission',
            old_name='type',
            new_name='kind',
        ),
        migrations.AlterField(
            model_name='submission',
            name='problemStatement',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='submission', to='problemStatements.ProblemStatement'),
        ),
    ]