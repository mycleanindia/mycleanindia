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

from __future__ import unicode_literals
from django.db import models

class statusReport(models.Model):
    """
    The model to manage the status reports.
    """
    description = models.CharField(max_length=80)
    status = models.CharField(max_length=30)
    coordinates = models.CharField(max_length=30)
    owner = models.CharField(max_length=100, default="NULL")
    likes = models.IntegerField(default=0)
    unlikes = models.IntegerField(default=0)
    address = models.CharField(max_length=200, default="Unknown")
    pincode = models.CharField(max_length=200, default="Unknown")
    created_at = models.DateTimeField(auto_now_add=True)


class reactionTable(models.Model):
	"""
	Manages reactions on a report.
	"""		
	reacting_user = models.CharField(max_length=100)
	reaction_report = models.IntegerField()
	vote = models.IntegerField(default=2)