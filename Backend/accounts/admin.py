from django.contrib import admin
from .models import User,Startup,Student
# Register your models here.

admin.site.register(User)
admin.site.register(Startup)
admin.site.register(Student)
