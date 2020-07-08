from django.db import models
from accounts.models import Student
import datetime

DIFFICULTY =(
    ('EASY','EASY'),
    ('MEDIUM','MEDIUM'),
    ('HARD','HARD')
)

TOPIC =(
    ('POINTERS','POINTERS'),
    ('ARRAYS','ARRAYS'),
    ('STRINGS','STRINGS'),
    ('HASHMAPS','HASHMAPS'),
    ('SORTING','SORTING'),
    ('RECURSION','RECURSION'),
    ('BACKTRACKING','BACKTRACKING'),
    ('STACKSANDQUEUES','STACKANDQUEUES'),
    ('LINKEDLISTS','LINKEDLISTS'),
    ('TREES','TREES'),
    ('GREEDY','GREEDY'),
    ('DYNAMICPROGRAMMING','DYNAMICPROGRAMMING'),
    ('GRAPHS','GRAPHS'),
)

class ProblemStatement(models.Model):
    title = models.CharField(null = True,blank = True, default= ' ',max_length=255)
    topic = models.CharField(max_length=50, choices=TOPIC,null=True,blank = True)
    description = models.TextField(null = True, blank=True,default=' ')
    difficulty = models.CharField(max_length=6, choices=DIFFICULTY,null=True,blank = True)
    content = models.TextField(null = True, blank=True,default=' ')
    instream = models.TextField(null = True, blank = True, default=' ')
    outstream = models.TextField(null = True, blank = True, default=' ')
    timeConstraint = models.CharField(max_length=100,null = True,blank = True)
    spaceConstraint = models.CharField(max_length=12,null = True,blank = True)
    createdDate = models.DateTimeField(default = datetime.datetime.now )
    updatedDate = models.DateTimeField(default = datetime.datetime.now )
    testInput = models.TextField(null = True,blank=True)
    testOutput = models.TextField(null = True,blank=True)

    def __str__(self):
        return self.title

class TestCases(models.Model):
    problemStatement = models.ForeignKey(ProblemStatement,related_name='testCases',on_delete = models.CASCADE,null = True, blank = True)
    Input = models.TextField(null = True, blank=True,default=' ')
    Output = models.TextField(null = True, blank=True,default=' ')

class Submission(models.Model):
    code = models.TextField(null = True,blank = True)
    student = models.ForeignKey(Student, related_name='submissions',on_delete = models.CASCADE,null = True, blank = True)
    kind = models.CharField(max_length=25,null = True,blank = True)
    stdout = models.TextField(null = True,blank = True)
    token = models.TextField(null = True,blank = True)
    timeTakenMillis = models.CharField(max_length=100,null = True,blank = True)
    spaceTakenBytes = models.CharField(max_length=12,null = True,blank = True)
    problemStatement = models.ForeignKey(ProblemStatement,related_name='submissions',on_delete = models.CASCADE,null = True, blank = True)
    language = models.CharField(max_length= 15,null=True,blank=True)
    createdDate = models.DateTimeField(default = datetime.datetime.now)
    updatedDate = models.DateTimeField(default = datetime.datetime.now)
    
    

class Discussion(models.Model):
    problemStatement = models.ForeignKey(ProblemStatement,default = '',on_delete = models.CASCADE,related_name = 'discussions')
    student = models.ForeignKey(Student,on_delete = models.CASCADE,default = '',related_name = 'discussions')
    title = models.CharField(max_length = 255,default = '')
    description = models.TextField(default='')
    createdDate = models.DateTimeField(default = datetime.datetime.now)
    updatedDate = models.DateTimeField(default = datetime.datetime.now)
    
    def __str__(self):
        return self.title
