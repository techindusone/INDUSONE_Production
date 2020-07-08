import graphene
from .models import User, Student, Startup
from graphql import GraphQLError
from .serializers import PasswordResetConfirmRetypeSerializer
from .utils import send_password_reset_email
import graphql_social_auth
from graphql_auth.mutations import PasswordReset, SendPasswordResetEmail
from graphene_django import DjangoObjectType
from enum import Enum
import jwt
from graphql_jwt.shortcuts import get_token


class Gender(Enum):
    M = 'M'
    F = 'F'


class Subscription(Enum):
    BASIC = 'BASIC'
    INTERMEDIATE = 'INTERMEDIATE'
    PROFESSIONAL = 'PROFESSIONAL'

# define object type: user


class UserType(DjangoObjectType):
    class Meta:
        model = User

# define object type: student


class StudentType(DjangoObjectType):
    class Meta:
        model = Student

# define object type: startup


class StartupType(DjangoObjectType):
    class Meta:
        model = Startup


# create admin
class CreateAdmin(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String()
        password = graphene.String()
        username = graphene.String()

    def mutate(self, info, email, username, password):
        user = User.objects.create(email=email)
        user.username = username
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return CreateAdmin(user=user)


# create student
class CreateStudent(graphene.Mutation):
    student = graphene.Field(StudentType)

    def validate_phone(self, value):
        if len(str(value)) == 10:
            return
        raise GraphQLError('field1 is BAD')

    class Arguments:
        username = graphene.String()
        password = graphene.String()
        name = graphene.String()
        email = graphene.String()
        phone = graphene.String()

    def mutate(self, info, username, name, email, phone, password):
        user = User.objects.create(email=email)
        user.set_password(password)
        user.is_student = True
        user.username = username
        student = Student.objects.create(user=user)
        student.name = name
        student.email = email
        student.phone = phone
        user.save()
        student.save()
        return CreateStudent(student=student)

# create startup


class CreateStartup(graphene.Mutation):
    startup = graphene.Field(StartupType)

    class Arguments:
        username = graphene.String()
        name = graphene.String()
        email = graphene.String()
        about = graphene.String()
        phone = graphene.String()
        password = graphene.String()

    def mutate(self, info, username, name, email, about, phone, password):
        user = User.objects.create(username=username)
        user.set_password(password)
        user.is_startup = True
        user.email = email
        startup = Startup.objects.create(user=user)
        startup.name = name
        startup.email = email
        startup.about = about
        startup.phone = phone
        user.save()
        startup.save()
        return CreateStartup(startup=startup)


class UpdateStudent(graphene.Mutation):
    student = graphene.Field(StudentType)

    class Arguments:
        name = graphene.String()
        username = graphene.String()
        phone = graphene.String()
        college = graphene.String()
        email = graphene.String()

    def mutate(self, info, name, username, phone, college, email):
        user = User.objects.get(email=email)
        user.username = username
        user.save()
        student = Student.objects.get(email=email)
        student.name = name
        student.user.username = username
        student.phone = phone
        student.college = college
        student.save()

        return UpdateStudent(student=student)


class PasswordResetEmail(graphene.Mutation):

    class Arguments:
        email = graphene.String()

    success = graphene.Boolean()

    def mutate(self, info, email):
        try:
            user = User.objects.get(email=email)

            send_password_reset_email(info.context, user)
            return PasswordResetEmail(success=True)
        except Exception:
            return PasswordResetEmail(success=False)


class ResetPasswordConfirm(graphene.Mutation):

    class Arguments:
        uid = graphene.String(required=True)
        token = graphene.String(required=True)
        email = graphene.String(required=True)
        new_password = graphene.String(required=True)
        re_new_password = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, uid, token, email, new_password, re_new_password):
        serializer = PasswordResetConfirmRetypeSerializer(data={
            'uid': uid,
            'token': token,
            'email': email,
            'new_password': new_password,
            're_new_password': re_new_password,
        })
        if serializer.is_valid():
            serializer.user.set_password(serializer.data['new_password'])
            serializer.user.save()
            return ResetPasswordConfirm(success=True, errors=None)
        else:
            return ResetPasswordConfirm(success=False, errors=[serializer.errors])


class SocialAuth(graphql_social_auth.SocialAuthMutation):
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String(required=False)

    @classmethod
    def resolve(cls, root, info, email, social, **kwargs):
        user = social.user
        print(user)
        # loginUser = Student.objects.get(email=user.email)
        # print(loginUser)
        user.is_student = True
        student = Student.objects.create(user=social.user)
        student.name = user.first_name + " " + user.last_name
        if(email != None):
            student.email = email
        else:
            student.email = user.email
        student.save()
        user.save()
        return cls(user=social.user)


class SocialAuthJWT(graphql_social_auth.SocialAuthJWT):
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String(required=False)
        provider = graphene.String()
        access_token = graphene.String()

    @classmethod
    def resolve(cls, root, info, social, **kwargs):
        user = social.user
        print("kwargs")
        print(social.provider)
        if(social.provider == "google-oauth2"):
            studentCheck = Student.objects.filter(email=user.email).exists()
            if studentCheck != False:
                print('Email Exists')
                student = Student.objects.get(email=user.email)
                if student.hasGoogle == False:
                    student.hasGoogle = True
                    student.save()
                    # Do not return Social.User here return student's user object i have used
                return cls(user=user, token=get_token(social.user, info.context))
        else:
            studentCheck = Student.objects.filter(
                email=kwargs["email"]).exists()
            print(studentCheck)
            if studentCheck != False:
                print('Email Exists')
                student = Student.objects.get(email=kwargs["email"])
                if student.hasLinkedIn == False:
                    student.hasLinkedIn = True
                    student.save()
                    # Do not return Social.User here return student's user object i have used
                return cls(user=user, token=get_token(social.user, info.context))
        print(user)
        user.is_student = True
        student = Student.objects.create(user=social.user)
        student.name = user.first_name + " " + user.last_name
        if(kwargs == {}):
            print('Creating Google User')
            student.email = user.email
            student.hasGoogle = True
        else:
            print('Creating LinkedIn User')
            student.email = kwargs['email']
            # user.email = kwargs['email']
            student.hasLinkedIn = True
        # student.email = user.email
        student.save()
        user.save()
        return cls(user=user, token=get_token(social.user, info.context))


class DeleteUser(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.String()

    def mutate(self, info, id):
        admin = info.context.user

        if admin.is_superuser:
            user = User.objects.get(id=id)
            user.delete()
        else:
            raise GraphQLError("You are not an ADMIN")

        return DeleteUser(success=True)


class DeleteAdmin(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.String()

    def mutate(self, info, id):
        admin = info.context.user

        if admin.is_superuser:
            user = User.objects.get(id=id)
            user.delete()
        else:
            raise GraphQLError("You are not an ADMIN")

        return DeleteUser(success=True)
