from django.db import models

# Create your models here.
class JournalEntry(models.Model):
    mood_choices = [
        (0, '0'),
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
        (6, '6'),
        (7, '7'),
        (8, '8'),
        (9, '9'),
        (10, '10'),
    ]
    title = models.CharField(max_length=50, null=True, blank=True)
    entry = models.TextField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)
    mood = models.IntegerField(default=5, choices=mood_choices)
    #item_price = models.DecimalField(max_digits=4, decimal_places=2)
    #item_img = models.ImageField(upload_to="uploads/food_images/", null=True, blank=True)

    def __str__(self):
        return f'{self.title}, {self.date_created}'