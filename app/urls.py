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

from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='app'),
    url(r'^fetch_status_reports$', 
        views.fetch_status_reports, name='fetch_status_reports'),
    url(r'^update_status_reports$', 
        views.update_status_reports, name='update_status_reports'),
    url(r'^delete_status_reports$', 
        views.delete_status_reports, name='delete_status_reports'),
    url(r'^save_new_status_reports$', 
        views.save_new_status_reports, name='save_new_status_reports'),
    url(r'^fetch_statistics$', 
        views.fetch_statistics, name='fetch_statistics'),
    url(r'^fetch_report_feeds$', 
        views.fetch_report_feeds, name='fetch_report_feeds'),
    url(r'^fetch_my_status_reports$', 
        views.fetch_my_status_reports, name='fetch_my_status_reports'),
    url(r'^fetch_contributions$', 
        views.fetch_contributions, name='fetch_contributions'),
    url(r'^logout/$', views.logout, name='logout'),
]