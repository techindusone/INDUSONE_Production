from django.db import models
from accounts.models import User
import datetime
from forum.models import Forum
from problemStatements.models import Discussion
# POST MODEL


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    title = models.CharField(
        max_length=255, default=' ', null=True, blank=True)
    description = models.TextField(default=' ', null=True, blank=True)
    image = models.FileField(upload_to='post_image', blank=True)
    tags = models.TextField(null=True, blank=True)
    dateCreated = models.DateTimeField(
        default=datetime.datetime.now, null=False)

    def __str__(self):
        return self.title


class Comment(models.Model):
    user = models.ForeignKey(
        User, related_name='comments', on_delete=models.CASCADE, null=False)
    body = models.TextField(max_length=255, default='', null=False)
    post = models.ForeignKey(Post, related_name='comments',
                             on_delete=models.CASCADE, null=True, blank = True)
    dateCreated = models.DateTimeField(
        default=datetime.datetime.now, null=False)
    forum = models.ForeignKey(
        Forum, on_delete=models.CASCADE, related_name='comments', null = True,blank = True)

    discussion = models.ForeignKey(Discussion,on_delete=models.CASCADE,related_name='comments',null = True,blank = True)

    def __str__(self):
        return self.body


class Tag(models.Model):
    tag = models.CharField(max_length= 255, default='')
    post = models.ForeignKey(Post, related_name='tag',on_delete=models.CASCADE)

    def __str__(self):
        return self.tag