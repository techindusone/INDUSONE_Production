from django.contrib import admin
from .models import ProblemStatement, TestCases,Submission,Discussion
# from django_markdown.models import MarkdownField
# Register your models here.

# admin.site.register(MarkdownField)
admin.site.register(ProblemStatement)
admin.site.register(TestCases)
admin.site.register(Submission)
admin.site.register(Discussion)