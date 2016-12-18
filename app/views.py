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

#from __future__ import print_function
import datetime
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.template.response import TemplateResponse
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.db.models import Count
import json
from math import floor
from models import statusReport
import string


def index(request):
    """
    Args: request.
    Returns: default application view.
    """
    return TemplateResponse(request, 'app/app.html',)


@csrf_exempt
def fetch_status_reports(request):
    """
    Args: request.
    Returns: Fetched status reports from the datastore.
    """
    if request.method == 'GET' and request.is_ajax():
        statuses = statusReport.objects.values(
            'id','description', 'status', 'coordinates', 'owner')
        #print(statuses_json.content)
        return JsonResponse(list(statuses), safe=False)


@csrf_exempt
def fetch_my_status_reports(request):
    """
    Args: request.
    Returns: Fetched status reports from the datastore.
    """
    if request.user.is_authenticated():
        if request.method == 'GET' and request.is_ajax():
            statuses = statusReport.objects.values(
                'id', 'description', 'status', 'coordinates', 'address').filter(
                owner=request.user.get_username())
            #print(statuses)
            return JsonResponse(list(statuses), safe=False)


@csrf_exempt
def delete_status_reports(request):
    """
    Args: request.
    Returns: Response on deletion.
    """
    if request.method == 'POST' and request.is_ajax():
        data_string = request.POST.get('json_data')
        data_dict = json.loads(data_string)
        eid=data_dict['statid']
        evnt = statusReport.objects.get(pk = eid)
        evnt.delete()
        return JsonResponse('Success', safe=False)


@csrf_exempt
def update_status_reports(request):
    """
    Args: request.
    Returns: Modifies existing report and saves new one on datastore.
    """
    if request.method == 'POST' and request.is_ajax():
        data_string = request.POST.get('json_data')
        data_dict = json.loads(data_string)
        description=data_dict['name']
        status=data_dict['type']
        coordinates=data_dict['latlang']
        eid=data_dict['statid']
        evnt = statusReport.objects.get(pk = eid)
        evnt.description=description
        evnt.status=status
        evnt.coordinates=coordinates
        evnt.save()
        return JsonResponse('Success', safe=False)


@csrf_exempt
def save_new_status_reports(request):
    """
    Args: request.
    Returns: Modifies existing report and saves new one on datastore.
    """
    if request.method == 'POST' and request.is_ajax():
        data_string = request.POST.get('json_data')
        data_dict = json.loads(data_string)
        description=data_dict['name']
        status=data_dict['type']
        coordinates=data_dict['latlang']
        owner=data_dict['owner']
        address=data_dict['address']
        pincode=data_dict['pincode']
        p = statusReport(
            description=description, status=status, coordinates=coordinates,
             owner=owner, address=address, pincode=pincode)
        p.save()
        return JsonResponse('Success', safe=False)


@csrf_exempt
def fetch_statistics(request):
    """
    Args: request.
    Returns: Statistical data.
    """
    if request.method == 'GET' and request.is_ajax():
        statusset = statusReport.objects.all().annotate(count = Count('status'))
        status_record = { 'Severe': 0, 'In Progress': 0, 'Clean': 0}
        for each in statusset:
            status_record[str(each.status)] += each.count
        status_record['in_progress'] = status_record.pop('In Progress')
        return JsonResponse(status_record, safe=False)


@csrf_exempt
def fetch_report_feeds(request):
    """
    Args: request.
    Returns: Fetches status reports from the datastore.
    """
    if request.method == 'GET' and request.is_ajax():
        statuses = statusReport.objects.values(
            'id','description', 'status', 'coordinates', 'owner',
             'likes', 'unlikes', 'address').order_by('-id') 
        #print(statuses_json.content)
        return JsonResponse(list(statuses), safe=False)


@csrf_exempt
def fetch_contributions(request):
    """
    Args: request.
    Returns: Fetches contributions of a user.
    """
    if request.user.is_authenticated():
        if request.method == 'GET' and request.is_ajax():
            now = datetime.datetime.now()
            record = dict()
            months = { 1: "Jan", 2: "Feb", 3: "Mar",
                4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
                9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}
            for i in xrange(0,6):
                temp = now.month - i
                if temp <= 0:
                    record[temp + 12] = (
                        statusReport.objects.filter(
                            created_at__month=temp+12).filter(
                            owner=request.user.get_username()).count())
                    record[months[temp + 12]] = record.pop(temp + 12)
                else:
                    record[temp] = (
                        statusReport.objects.filter(
                            created_at__month=temp).filter(
                            owner=request.user.get_username()).count())
                    record[months[temp]] = record.pop(temp)
            #print(record)
            return JsonResponse(record, safe=False)


def logout(request):
    """
    Args: request.
    Returns: Triggers logout action.
    """
    auth_logout(request)
    return redirect('/')
