from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_emailverificationcode"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql=(
                        'ALTER TABLE "users_emailverificationcode" '
                        "ADD COLUMN IF NOT EXISTS purpose varchar(32) "
                        "NOT NULL DEFAULT 'signup';"
                    ),
                    reverse_sql=(
                        'ALTER TABLE "users_emailverificationcode" '
                        "DROP COLUMN IF EXISTS purpose;"
                    ),
                ),
            ],
            state_operations=[
                migrations.AddField(
                    model_name="emailverificationcode",
                    name="purpose",
                    field=models.CharField(default="signup", max_length=32),
                ),
            ],
        ),
    ]