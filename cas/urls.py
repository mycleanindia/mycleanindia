# coding: utf-8
#
# Copyright 2016 The MyCleanIndia Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from django.conf.urls import url, include
from django.contrib import admin
import django.contrib.auth.views
from django.conf import settings

admin.site.site_header = settings.ADMIN_SITE_HEADER
admin.site.site_title = settings.ADMIN_SITE_TITLE

urlpatterns = [
	url(r'', include('app.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^app/', include('app.urls')),
    url('', include('social.apps.django_app.urls', namespace='social')),
]

