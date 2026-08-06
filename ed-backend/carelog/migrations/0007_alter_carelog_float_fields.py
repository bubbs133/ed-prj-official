from django.db import migrations, models


class Migration(migrations.Migration):
    """
    Bring the DB schema in line with the model: the rating fields and
    exercise_minutes are FloatField in models.py but were still IntegerField
    in the migration history (only num_meals/sleep_hours were converted in
    0005). On Postgres an integer column rejects decimal values, so this
    completes the float conversion.
    """

    dependencies = [
        ('carelog', '0006_alter_carelog_notes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='carelog',
            name='urge_intensity',
            field=models.FloatField(blank=True, default=5.0),
        ),
        migrations.AlterField(
            model_name='carelog',
            name='binge_urge',
            field=models.FloatField(blank=True, default=5.0),
        ),
        migrations.AlterField(
            model_name='carelog',
            name='restriction',
            field=models.FloatField(blank=True, default=5.0),
        ),
        migrations.AlterField(
            model_name='carelog',
            name='emotional_distress',
            field=models.FloatField(blank=True, default=5.0),
        ),
        migrations.AlterField(
            model_name='carelog',
            name='stress_level',
            field=models.FloatField(blank=True, default=5.0),
        ),
        migrations.AlterField(
            model_name='carelog',
            name='energy_level',
            field=models.FloatField(blank=True, default=5.0),
        ),
        migrations.AlterField(
            model_name='carelog',
            name='exercise_minutes',
            field=models.FloatField(blank=True, default=30),
        ),
    ]
