"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.http import HttpResponseNotAllowed
from app.views.auth.email_verification import verify_email_view


def graphql_view(request, *args, **kwargs):
    """DEBUG=False では GET を拒否し、POST のみ許可する。
    JWT ベースのため CSRF は免除する。
    """
    if request.method == "GET" and not settings.DEBUG:
        return HttpResponseNotAllowed(["POST"])

    view = GraphQLView.as_view(graphiql=settings.DEBUG)
    return view(request, *args, **kwargs)


urlpatterns = [
    path("admin/", admin.site.urls),
    # GraphiQL は DEBUG=True のとき GET 許可、それ以外は POST のみ
    path("graphql/", csrf_exempt(graphql_view)),
    # メール確認用エンドポイント
    path("verify-email/<str:token>/", verify_email_view, name="verify_email"),
]
