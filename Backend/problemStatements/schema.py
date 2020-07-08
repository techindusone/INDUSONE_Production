import requests
import graphene
import graphql_jwt
import stripe
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from .models import ProblemStatement, TestCases, Submission, Discussion
from enum import Enum
from graphql import GraphQLError
from graphql_relay.node.node import from_global_id
from graphene_file_upload.scalars import Upload
import graphql_social_auth
import datetime
from tutorials.models import Tutorial
from graphene_file_upload.scalars import Upload
from .utils import get_paginator

from articles.schema import (
    CreatePost, CreateComment, UpdatePost,
    DeleteComment, DeletePost, PostType, CommentType, UpdateComment
)

from articles.models import Post, Comment
from accounts.models import User, Startup, Student

from accounts.schema import (
    CreateStartup, CreateStudent, SocialAuth, PasswordResetEmail, ResetPasswordConfirm,
    StudentType, StartupType, SocialAuthJWT, UserType, CreateAdmin, UpdateStudent, DeleteUser, DeleteAdmin
)

from tutorials.schema import (
    CreateTutorial, UpdateTutorial, DeleteTutorial, TutorialType
)

from forum.schema import (
    CreateForum, UpdateForum, DeleteForum, ForumType
)
from forum.models import Forum


class Difficulty(Enum):
    EASY = 'EASY'
    MEDIUM = 'MEDIUM'
    HARD = 'HARD'


class _Difficulty(Enum):
    EASY = 'EASY'
    MEDIUM = 'MEDIUM'
    HARD = 'HARD'


class Topic(Enum):
    POINTERS = 'POINTERS'
    ARRAYS = 'ARRAYS'
    STRINGS = 'STRINGS'
    HASHMAPS = 'HASHMAPS'
    SORTING = 'SORTING'
    RECURSION = 'RECURSION'
    BACKTRACKING = 'BACKTRACKING'
    STACKSANDQUEUES = 'STACKANDQUEUES'
    LINKEDLIST = 'LINKEDLISTS'
    TREES = 'TREES'
    GREEDY = 'GREEDY'
    DYNAMICPROGRAMMING = 'DYNAMICPROGRAMMING'
    GRAPHS = 'GRAPHS'


class _Topic(Enum):
    POINTERS = 'POINTERS'
    ARRAYS = 'ARRAYS'
    STRINGS = 'STRINGS'
    HASHMAPS = 'HASHMAPS'
    SORTING = 'SORTING'
    RECURSION = 'RECURSION'
    BACKTRACKING = 'BACKTRACKING'
    STACKSANDQUEUES = 'STACKANDQUEUES'
    LINKEDLIST = 'LINKEDLISTS'
    TREES = 'TREES'
    GREEDY = 'GREEDY'
    DYNAMICPROGRAMMING = 'DYNAMICPROGRAMMING'
    GRAPHS = 'GRAPHS'


class PostPaginatedType(graphene.ObjectType):
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    objects = graphene.List(PostType)


# define object type: test case
class TestCasesType(DjangoObjectType):
    class Meta:
        model = TestCases

# define object type: problem statement


class ProblemStatementType(DjangoObjectType):
    class Meta:
        model = ProblemStatement

    def resolve_testCases(self, info):
        return self.testCases.all()

# define object type: submission


class SubmissionType(DjangoObjectType):
    class Meta:
        model = Submission


class DiscussionType(DjangoObjectType):
    class Meta:
        model = Discussion

    def resolve_comments(self, info):
        return self.comments.all()


class CreateDiscussion(graphene.Mutation):
    discussion = graphene.Field(DiscussionType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        prob_id = graphene.String()

    def mutate(self, info, **kwargs):
        problem = ProblemStatement.objects.get(id=kwargs["prob_id"])
        user = info.context.user
        student = Student.objects.get(user=user)
        discussion = Discussion.objects.create(
            student=student, problemStatement=problem)
        discussion.title = kwargs["title"]
        discussion.description = kwargs["description"]
        discussion.createdDate = datetime.datetime.now()
        discussion.updatedDate = datetime.datetime.now()

        discussion.save()
        return CreateDiscussion(discussion=discussion)


class UpdateDiscussion(graphene.Mutation):
    discussion = graphene.Field(DiscussionType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        id = graphene.String()

    def mutate(self, info, **kwargs):
        user = info.context.user
        student = Student.objects.get(user=user)
        discussion = Discussion.objects.get(id=kwargs["id"], student=student)
        discussion.title = kwargs["title"]
        discussion.description = kwargs["description"]
        discussion.updatedDate = datetime.datetime.now()
        discussion.save()

        return UpdateDiscussion(discussion=discussion)


class DeleteDiscussion(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.String()

    def mutate(self, info, id):
        user = info.context.user
        student = Student.objects.get(user=user)
        discussion = Discussion.objects.get(id=id, student=student)
        discussion.delete()

        return DeleteDiscussion(success=True)


# create user
class UserInput(graphene.InputObjectType):
    username = graphene.String()


# create problem statement
class CreateSubmission(graphene.Mutation):
    submission = graphene.Field(SubmissionType)

    class Arguments:
        code = graphene.String()
        kind = graphene.String()
        stdout = graphene.String()
        token = graphene.String()
        timeTakenMillis = graphene.String()
        spaceTakenBytes = graphene.String()
        problemStatementId = graphene.String()
        language = graphene.String()

    def mutate(self, info, code, kind, stdout, token, timeTakenMillis, spaceTakenBytes, problemStatementId, language):
        user = info.context.user
        student = Student.objects.get(user=info.context.user)
        problem = ProblemStatement.objects.get(id=problemStatementId)
        submission = None
        if user.id == None:
            raise GraphQLError('Not Authorised')
        if user.is_student:
            submission = Submission.objects.create(
                code=code, kind=kind, problemStatement=problem, language=language, student=student)
            submission.stdout = stdout
            submission.timeTakenMillis = timeTakenMillis
            submission.spaceTakenBytes = spaceTakenBytes
            submission.createdDate = datetime.datetime.now()
            submission.updatedDate = datetime.datetime.now()
            submission.save()
        else:
            raise GraphQLError('Not a Student')

        return CreateSubmission(submission=submission)


class CreateProblemStatement(graphene.Mutation):
    problemStatement = graphene.Field(ProblemStatementType)

    class Arguments:
        title = graphene.String()
        topic = graphene.Argument(graphene.Enum.from_enum(Topic))
        description = graphene.String()
        difficulty = graphene.Argument(graphene.Enum.from_enum(Difficulty))
        content = graphene.String()
        timeConstraint = graphene.String()
        spaceConstraint = graphene.String()
        instream = graphene.String()
        outstream = graphene.String()

    def mutate(self, info, title, topic, description, content, difficulty, timeConstraint, spaceConstraint, instream, outstream):
        user = info.context.user
        problemStatement = None
        if user.id == None:
            raise GraphQLError('Not Authorised')
        if user.is_superuser:
            problemStatement = ProblemStatement.objects.create(
                title=title, description=description, content=content, difficulty=difficulty, topic=topic)
            problemStatement.timeConstraint = timeConstraint
            problemStatement.spaceConstraint = spaceConstraint
            problemStatement.instream = instream
            problemStatement.outstream = outstream
            problemStatement.createdDate = datetime.datetime.now()
            problemStatement.updatedDate = datetime.datetime.now()

            problemStatement.save()
        else:
            raise GraphQLError('Not a Staff Member')

        return CreateProblemStatement(problemStatement=problemStatement)


class UpdateProblemStatement(graphene.Mutation):
    problemStatement = graphene.Field(ProblemStatementType)

    class Arguments:
        id = graphene.String(required=True)
        title = graphene.String(required=False)
        topic = graphene.Argument(graphene.Enum.from_enum(_Topic))
        description = graphene.String(required=False)
        difficulty = graphene.Argument(graphene.Enum.from_enum(_Difficulty))
        content = graphene.String(required=False)
        timeConstraint = graphene.String(required=False)
        spaceConstraint = graphene.String(required=False)
        instream = graphene.String(required=False)
        instream = graphene.String(required=False)
        outstream = graphene.String(required=False)

    def mutate(self, info, id, title, topic, description, content, difficulty, timeConstraint, spaceConstraint, instream, outstream):
        user = info.context.user
        if user.id == None:
            raise GraphQLError('Not Authorised')
        if user.is_superuser:
            problemStatement = ProblemStatement.objects.get(id=id)
            if title != '':
                problemStatement.title = title
            if description != '':
                problemStatement.description = description
            if topic != '':
                problemStatement.topic = topic
            if content != '':
                problemStatement.content = content
            if instream != '':
                problemStatement.instream = instream
            if outstream != '':
                problemStatement.outstream = outstream
            if timeConstraint != '':
                problemStatement.timeConstraint = timeConstraint
            if spaceConstraint != '':
                problemStatement.spaceConstraint = spaceConstraint
            problemStatement.difficulty = difficulty
            problemStatement.updatedDate = datetime.datetime.now()
            problemStatement.save()
        else:
            raise GraphQLError('Not Authorised')
        return UpdateProblemStatement(problemStatement=problemStatement)


class DeleteProblemStatement(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.String()

    def mutate(self, info, id):
        problemStatement = ProblemStatement.objects.filter(id=id)
        # print(problemStatement)
        if problemStatement.count() == 0:
            raise GraphQLError('Problem Statement with this ID does not exist')

        problemStatement.delete()
        return DeleteProblemStatement(success=True)


class MakePayment(graphene.Mutation):
    client_secret = graphene.String()

    class Arguments:
        amount = graphene.Int()
        currency = graphene.String()
        token = graphene.String()

    def mutate(self, info, amount, currency, token):
        stripe.api_key = 'sk_test_jiutuE1oKb70yxUol1ihDzUx00xktQqlgh'

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            metadata={'integration_check': 'accept_a_payment'},
        )
        return MakePayment(client_secret=intent.client_secret)


class UploadMutation(graphene.Mutation):
    class Arguments:
        file = Upload(required=True)
        postId = graphene.String()

    success = graphene.Boolean()

    def mutate(self, info, file, postId):
        print('POST IMAGE: ')
        print(file)
        print('POST ID: ')
        print(postId)
        blog = Post.objects.get(id=postId)
        blog.image = file
        blog.save()
        return UploadMutation(success=True)


class TokenAuth(graphql_jwt.ObtainJSONWebToken):
    # test = graphene.String()
    user = graphene.Field(UserType)
    @classmethod
    def resolve(cls, root, info, **kwargs):
        user = info.context.user
        return cls(user=user)


class Mutation(graphene.ObjectType):
    createProblemStatement = CreateProblemStatement.Field()
    updateProblemStatement = UpdateProblemStatement.Field()
    deleteProblemStatement = DeleteProblemStatement.Field()
    createAdmin = CreateAdmin.Field()
    createStudent = CreateStudent.Field()
    createStartup = CreateStartup.Field()
    token_auth = TokenAuth.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    createPost = CreatePost.Field()
    updatePost = UpdatePost.Field()
    deletePost = DeletePost.Field()
    createComment = CreateComment.Field()
    updateComment = UpdateComment.Field()
    deleteComment = DeleteComment.Field()
    # passwordReset = PasswordReset.Field()
    sendPasswordResetEmail = PasswordResetEmail.Field()
    social_auth = SocialAuthJWT.Field()
    makePayment = MakePayment.Field()
    updateStudent = UpdateStudent.Field()
    createTutorial = CreateTutorial.Field()
    updateTutorial = UpdateTutorial.Field()
    deleteTutorial = DeleteTutorial.Field()
    createForum = CreateForum.Field()
    updateForum = UpdateForum.Field()
    deleteForum = DeleteForum.Field()
    deleteUser = DeleteUser.Field()
    deleteAdmin = DeleteAdmin.Field()
    createDiscussion = CreateDiscussion.Field()
    updateDiscussion = UpdateDiscussion.Field()
    deleteDiscussion = DeleteDiscussion.Field()
    createSubmission = CreateSubmission.Field()
    uploadFile = UploadMutation.Field()


class Query(graphene.ObjectType):
    problemStatements = graphene.List(ProblemStatementType)
    ProblemStatement = graphene.Field(
        ProblemStatementType, ps_id=graphene.String())
    me = graphene.Field(StudentType)
    admins = graphene.List(UserType)
    posts = graphene.List(PostType)
    userPosts = graphene.List(PostType)
    searchPosts = graphene.List(PostType, arg=graphene.String())
    comments = graphene.List(CommentType, post_id=graphene.String())
    comment = graphene.Field(CommentType, comment_id=graphene.String())
    post = graphene.Field(PostType, post_id=graphene.String())
    postsPage = graphene.Field(
        PostPaginatedType, page=graphene.Int(), arg=graphene.String())
    students = graphene.List(StudentType)
    student = graphene.Field(StudentType, user=graphene.Argument(UserInput))
    startups = graphene.List(StartupType)
    startup = graphene.Field(StartupType, user=graphene.Argument(UserInput))
    tutorials = graphene.List(TutorialType)
    tutorial = graphene.Field(TutorialType, id=graphene.String())
    forums = graphene.List(ForumType)
    forum = graphene.Field(ForumType, id=graphene.String())
    discussions = graphene.List(DiscussionType, probId=graphene.String())
    discussion = graphene.Field(DiscussionType, discussionId = graphene.String())
    submissions = graphene.List(SubmissionType, probId=graphene.String())

    def resolve_problemStatements(self, info):
        return ProblemStatement.objects.all()

    def resolve_me(self, info):
        print(info.context.user.id)
        if(not info.context.user.is_authenticated):
            raise GraphQLError('Unauthenticated')
        return Student.objects.get(user_id=info.context.user.id)

    def resolve_admins(self, info):
        print(info.context.user.id)
        if(not info.context.user.is_authenticated):
            raise GraphQLError('Unauthenticated')
        return User.objects.filter(is_superuser=True)

    def resolve_problemStatement(self, info, ps_id):
        return ProblemStatement.objects.get(id=ps_id)

    # def resolve_postsPage(self, info, page):
    #     page_size = 10
    #     qs = Post.objects.all()
    #     return get_paginator(qs, page_size, page, PostPaginatedType)

    def resolve_postsPage(self, info, page, arg):
        page_size = 10
        if arg == '':
            qs = Post.objects.order_by('dateCreated').reverse()
            return get_paginator(qs, page_size, page, PostPaginatedType)
        else:
            qs = Post.objects.filter(title__icontains=arg).order_by('dateCreated').reverse()
            return get_paginator(qs, page_size, page, PostPaginatedType)

    def resolve_posts(self, info):
        return Post.objects.all()

    def resolve_searchPosts(self, info, arg):
        return Post.objects.filter(title__icontains=arg)

    def resolve_userPosts(self, info):
        if(not info.context.user.is_authenticated):
            raise GraphQLError('Unauthenticated')
        return Post.objects.get(user=info.context.user)

    def resolve_post(self, info, post_id):
        return Post.objects.get(id=post_id)

    def resolve_comments(self, info, post_id):
        post = Post.objects.get(id=post_id)
        return Comment.objects.filter(post=post)

    def resolve_comment(self, info, **kwargs):
        return Comment.objects.get(id=kwargs["comment_id"])

    def resolve_students(self, info):
        return Student.objects.all()

    def resolve_student(self, info, user):
        return Student.objects.get(user__username=user.username)

    def resolve_startups(self, info):
        return Startup.objects.all()

    def resolve_startup(self, info, user):
        return Startup.objects.get(user__username=user.username)

    def resolve_tutorials(self, info):
        return Tutorial.objects.all()

    def resolve_tutorial(self, info, id):
        return Tutorial.objects.get(id=id)

    def resolve_forums(self, info):
        return Forum.objects.all()

    def resolve_forum(self, infom, id):
        return Forum.objects.get(id=id)

    def resolve_discussions(self, info, probId):
        problem = ProblemStatement.objects.get(id=probId)
        return problem.discussions.all()

    def resolve_discussion(self,info,discussionId):
        discussion = Discussion.objects.get(id = discussionId)
        return discussion

    def resolve_submissions(self, info, probId):
        print(probId)
        student = Student.objects.get(user=info.context.user)
        print(student)
        submissions = Submission.objects.filter(
            problemStatement__id=probId, student=student)
        return submissions


schema = graphene.Schema(
    query=Query,
    mutation=Mutation,
)
