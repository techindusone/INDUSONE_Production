from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# Create your models here.
GENDER = (
    ('M','M'),
    ('F','F')
)
SUBSCRIPTION = (
    ('BASIC','BASIC'),
    ('INTERMEDIATE', 'INTERMEDIATE'),
    ('PROFESSIONAL', 'PROFESSIONAL')
)

def validate_length(value,length=10):
    if len(str(value))!= length:
        raise ValidationError(u'%s is not the correct length' % value)

class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_startup = models.BooleanField(default=False)
    google = models.CharField(max_length = 255, null= True, blank= True)
    linkedin = models.CharField(max_length = 255, null= True, blank= True)
    github = models.CharField(max_length = 255, null= True, blank= True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def get_username(self):
        return self.email

    def __str__(self):
        return self.username
    
User._meta.get_field('email')._unique=True

class Student(models.Model):
    user = models.OneToOneField(User,on_delete = models.CASCADE,related_name = 'student',primary_key = True)
    name = models.CharField(max_length=255,default = '')
    email = models.EmailField(default = '')
    phone = models.CharField(max_length = 10,validators=[validate_length], default = '')
    gender = models.CharField(max_length= 1, choices=GENDER,null= True, blank = True)
    college = models.CharField(max_length=255,null=True,blank = True)
    subscription = models.CharField(max_length=20,choices=SUBSCRIPTION,default='BASIC',null=True,blank='True')
    hasGoogle = models.BooleanField(default=False)
    hasLinkedIn = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


class Startup(models.Model):
    user = models.OneToOneField(User,on_delete = models.CASCADE,related_name = 'startup', primary_key = True)
    name = models.CharField(max_length=255, default = '')
    email = models.EmailField(default = '')
    phone = models.CharField(max_length = 10,validators=[validate_length], default = '')
    about = models.TextField(null = True,blank = True)
    website =  models.CharField(max_length=255,null=True,blank = True)

    def __str__(self):
        return self.user.username