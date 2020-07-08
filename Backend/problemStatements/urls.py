from django.urls import path, include
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import views as auth_views
from accounts.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import PasswordResetForm
from .views import Home
from graphene_file_upload.django import FileUploadGraphQLView


class CustomEmailValidationOnForgotPassword(PasswordResetForm):
    def clean_email(self):
        email_id = self.cleaned_data['email']
        if not User.objects.filter(email__iexact=email_id, is_active=True).exists():
            raise ValidationError("Invalid Email!")

        return self.cleaned_data['email']

    def get_users(self, email):
        """Given an email, return matching user(s) who should receive a reset.

        This allows subclasses to more easily customize the default policies
        that prevent inactive users and users with unusable passwords from
        resetting their password.
        """
        active_users = User._default_manager.filter(**{
            '%s__iexact' % User.get_email_field_name(): email,
            'is_active': True,
        })
        d = (u for u in active_users)
        return d


urlpatterns = [

    path('graphql', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    path('password-reset', auth_views.PasswordResetView.as_view(template_name="password_reset.html",
                                                                form_class=CustomEmailValidationOnForgotPassword, success_url='/password_reset/done/'), name="password-reset"),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(
        template_name="password_reset_done.html"), name='done'),
    path('password_reset_confirm/<uidb64>/<token>', auth_views.PasswordResetConfirmView.as_view(
        template_name='password_reset_confirm.html', success_url='/password_reset_complete/'), name='password_reset_confirm'),
    path('password_reset_complete/', auth_views.PasswordResetCompleteView.as_view(
        template_name='password_reset_complete.html'), name="password_reset_complete"),
    path('', Home, name='home')


]
