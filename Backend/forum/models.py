from django.db import models
import datetime
from accounts.models import Student
# Create your models here.
class Forum(models.Model):
    user = models.ForeignKey(Student, related_name="forums",on_delete = models.CASCADE)
    title = models.CharField(max_length=255,default="")
    description = models.TextField(default="")
    content = models.TextField(default="")
    createdDate = models.DateTimeField(default = datetime.datetime.now)
    updatedDate = models.DateTimeField(default = datetime.datetime.now)