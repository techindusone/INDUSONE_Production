import graphene
from graphene_django import DjangoObjectType
from .models import Forum
from accounts.models import Student
import datetime
from graphql import GraphQLError

class ForumType(DjangoObjectType):
    class Meta:
        model = Forum
    
    def resolve_comments(self,info):
        return self.comments.all()
    
class CreateForum(graphene.Mutation):
    forum = graphene.Field(ForumType)
    
    class Arguments:
        title = graphene.String()
        description = graphene.String()
        content = graphene.String()
        
    def mutate(self,info, **kwargs):
        user = info.context.user
        student = Student.objects.get(user = user)
        forum = Forum.objects.create(user = student,title = kwargs["title"],description = kwargs["description"],content = kwargs["content"])
        forum.createdDate = datetime.datetime.now()
        forum.updatedDate = datetime.datetime.now()
        forum.save()
        
        return CreateForum(forum = forum)
    
class UpdateForum(graphene.Mutation): 
    forum = graphene.Field(ForumType)
    
    class Arguments:
        id = graphene.String()
        title = graphene.String()
        description = graphene.String()
        content = graphene.String()
        
    def mutate(self,info,**kwargs):
        user = info.context.user
        student = Student.objects.get(user = user)
        forum = Forum.objects.get(id = kwargs["id"])
        if forum.user != student:
            raise GraphQLError("This is not your post :p")
        
        forum.title = kwargs["title"]
        forum.description = kwargs["description"]
        forum.content = kwargs["content"]
        forum.updatedDate = datetime.datetime.now()
        forum.save()
        
        return UpdateForum(forum = forum)
    
class DeleteForum(graphene.Mutation):
    success = graphene.Boolean()
    
    class Arguments:
        id = graphene.String()
        
    def mutate(self,info,id):
        forum = Forum.objects.get(id = id)
        forum.delete()
        
        return DeleteForum(success = True)        
               