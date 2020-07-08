import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from .models import Tutorial
import datetime

class TutorialType(DjangoObjectType):
    class Meta:
        model = Tutorial
    
    # createdDate = graphene.String()
    # updatedDate = graphene.String()

    # def resolve_createdDate(self, info):
    #     return str(self.createdDate.replace(microsecond=0))
    
    # def resolve_updatedDate(self, info):
    #     return str(self.updatedDate.replace(microsecond=0))
        
class CreateTutorial(graphene.Mutation):
    tutorial = graphene.Field(TutorialType)
    
    class Arguments:
        title = graphene.String()
        content = graphene.String()
        
    def mutate(self,info,title,content):
        user = info.context.user
        tutorial = None
        if user.is_superuser:
            tutorial = Tutorial.objects.create(title = title,content = content)
            tutorial.createdDate = datetime.datetime.now()
            tutorial.updatedDate = datetime.datetime.now()
        else:
            raise GraphQLError("Only Admins can post tutorials")
        tutorial.save()
        
        return CreateTutorial(tutorial = tutorial)
    
class UpdateTutorial(graphene.Mutation):
    tutorial = graphene.Field(TutorialType)
    
    class Arguments:
        id = graphene.String()
        title = graphene.String()
        content = graphene.String()
        
    def mutate(self,info,id,title,content):
        tutorial = Tutorial.objects.get(id = id)
        user = info.context.user
        if user.is_superuser:
            tutorial.title = title
            tutorial.content = content
            tutorial.updatedDate = datetime.datetime.now()
        else:
            raise GraphQLError("Only Admins can post tutorials")
        tutorial.save()
        
        return UpdateTutorial(tutorial = tutorial)
    
class DeleteTutorial(graphene.Mutation):
    success = graphene.Boolean()
    
    class Arguments:
        id = graphene.String()
        
    def mutate(self,info,id):
        tutorial = Tutorial.objects.get(id = id)
        tutorial.delete()
        
        return DeleteTutorial(success = True)
        
        

            
