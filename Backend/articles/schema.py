import graphene
from .models import Post, Comment
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from problemStatements.models import Discussion
#define object type: post
class PostType(DjangoObjectType):
    class Meta:
        model = Post
    
    # comments = graphene.List(CommentType)
    def resolve_comments (self,info):
        return self.comments.all()

#define object type: comment
class CommentType(DjangoObjectType):
    class Meta:
        model = Comment


#create Post
class CreatePost(graphene.Mutation):
    post = graphene.Field(PostType)
    
    class Arguments:
        title = graphene.String()
        description = graphene.String()
        tags = graphene.String()
        # post_image = Upload()
    
    def mutate(self,info,title,description,tags):
        # if info.context.user.id == None:
        #     raise GraphQLError('Unauthenticated')
        # files = post_image
        user = info.context.user
        if user.id == None:
            raise GraphQLError('Unauthenticated')
        post = Post.objects.create(user = user, title = title, description = description, tags = tags)
        post.save()
        return CreatePost(post = post)
        
#delete Post
class DeletePost(graphene.Mutation):
    result = graphene.String()
    
    class Arguments:
        postId = graphene.String()
        # post_image = Upload()
    
    def mutate(self,info,postId):
        # if info.context.user.id == None:
        #     raise GraphQLError('Unauthenticated')
        # files = post_image
        user = info.context.user
        if user.id == None:
            raise GraphQLError('Unauthenticated')
        Post.objects.get(user = user,id=postId).delete()
        return DeletePost(result = 'Success')

#Update Post
class UpdatePost(graphene.Mutation):
    post = graphene.Field(PostType)
    
    class Arguments:
        id = graphene.String()
        title = graphene.String()
        description = graphene.String()
        tags = graphene.String()
        
    def mutate(self, info,id,title,description,tags):
        user = info.context.user
        if user.id == None:
            raise GraphQLError('Unauthorised')
        post = Post.objects.get(user = user, id = id)
        post.title = title
        post.description = description
        post.tags = tags
        post.save()
        return UpdatePost(post = post)
        

# Create Comment
class CreateComment(graphene.Mutation):
    comment = graphene.Field(CommentType)

    class Arguments:
        body = graphene.String()
        postId = graphene.String(required = False)
        discussionId = graphene.String(required = False)
        forumId = graphene.String(required = False)

    def mutate(self, info, body, postId = None,discussionId = None,forumId = None):
        if info.context.user.id == None:
            raise GraphQLError('Unauthenticated')
        
        if postId != None:
            post = Post.objects.get(id = postId)
            comment = Comment.objects.create(user = info.context.user, body = body, post=post)
        
        elif discussionId !=None:
            discussion = Discussion.objects.get(id = discussionId)
            comment = Comment.objects.create(user = info.context.user, body = body, discussion = discussion)
        
        elif forumId != None:
            pass
        comment.save()
        return CreateComment(comment = comment)

class UpdateComment(graphene.Mutation):
    result = graphene.Boolean()
    class Arguments:
        body = graphene.String()
        id = graphene.String()
    
    def mutate(self,info,body,id):
        if info.context.user.id == None:
            raise GraphQLError('Unauthenticated')
        comment = Comment.objects.get(id = id)
        comment.body = body
        comment.save()
        return UpdateComment(result = True)

    
#Delete Comment
class DeleteComment(graphene.Mutation):
    result = graphene.String()
    
    class Arguments:
        id = graphene.String()
        
    def mutate(self,info,id):
        user = info.context.user
        if user.id == None:
            raise GraphQLError('Unauthorised')
        Comment.objects.get(user = user,id = id).delete()
        return DeleteComment(result = 'Success')
