from django.db import models
import datetime
# Create your models here.

class Tutorial(models.Model):
    title = models.CharField(max_length = 255, default = '')
    content = models.TextField(default= '')
    createdDate = models.DateTimeField(default = datetime.datetime.now)
    updatedDate = models.DateTimeField(default = datetime.datetime.now)
    