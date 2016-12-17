// Copyright 2016 The MyCleanIndia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview MyCleanIndia Custom Js.
 */

jQuery(function() {

	$(document).ready(function() {

        // Initial configuration
        var initialMapCenter = new google.maps.LatLng(22.9734, 80.6569);
        var map;
        var zoomLevel = 5; 

        $(".rotate").click(function(){
            $(this).toggleClass("down"); 
            map_initialize(map.getZoom(), map.getCenter());
        });

		$("input:text").keypress(function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });
        
        function statistics() {
            $.ajax({
                type: 'GET',      
                url:  'fetch_statistics',
                dataType: 'json',
                success: function(data) { 
                        var severe_stat = data.Severe;
                        var clean_stat = data.Clean;
                        var progress_stat = data.in_progress;          
                        
                        var allStatElement = document.getElementById("allStats").getContext('2d');
                        var allStats = new Chart(allStatElement, {
                            type: 'pie',
                            data: {
                            labels: ["Clean", "Severe", "In Progress"],
                            datasets: [{
                                backgroundColor: [
                                "#2ecc71",
                                "#e74c3c",
                                "#f1c40f"
                              ],
                            data: [clean_stat, severe_stat, progress_stat]
                            }]
                          }
                        });

                },
                error:function (xhr, ajaxOptions, thrownError){
                    console.log("Something went wrong!");
                    //alert(thrownError);
                }               
            });
        }

        // Report Feeds Method
        reportFeeds = function() {
            $.ajax({
                type: "GET",
                url: "fetch_report_feeds",
                dataType: 'json',              
                success: function (data) {
                    var feedBoxData = '';
                    if(typeof data[0] !== "undefined") {
                        $.each(data, function(i, item) {
                            var statusType = data[i].status;
                            var imageType = '';
                            var address = data[i].address;

                            if(statusType == "Clean") {
                                imageType = 'https://i.imgur.com/8jcjVUl.png';
                            }
                            else if(statusType == "In Progress") {
                                imageType = 'https://i.imgur.com/TClWkgY.png';
                            }
                            else if(statusType == "Severe") {
                                imageType = 'https://i.imgur.com/FXle0qD.png';
                            }

                            feedBoxData = feedBoxData + '<div class="feed-box" style="padding-left:10px;"><img src="https://cdn2.iconfinder.com/data/icons/rcons-user/32/male-shadow-fill-circle-512.png" style="margin-top:8px; display:inline" height="35px" width="35px"><p style="display:inline; padding-top:-10px"> ' + data[i].owner + '</p><div class="pull-right" style="padding-right:10px; padding-top:8px"><i class="fa fa-thumbs-up" style="padding-right:10px; color: #c12267; font-size: 12px" aria-hidden="true"> ' + data[i].likes + '</i><i class="fa fa-thumbs-down" style="color: #c12267; font-size: 12px" aria-hidden="true"> ' + data[i].unlikes + '</i></div><br><p style="font-size:12px; padding-top:10px;padding-bottom:5px; padding-left:4px;">' + data[i].description + '<br><img src="' + imageType + '" height="10px" width="10px"> &nbspnear ' + address + '.</p></div>'; 
                            //feedBoxData = feedBoxData + '<div class="feed-box" style="padding-left:10px;"><img src="https://cdn2.iconfinder.com/data/icons/rcons-user/32/male-shadow-fill-circle-512.png" style="margin-top:8px" height="35px" width="35px"> ' + data[i].owner + '<div class="pull-right" style="padding-right:10px; padding-top:8px"><i class="fa fa-thumbs-up" style="padding-right:10px; color: #c12267; font-size: 12px" aria-hidden="true"> ' + data[i].likes + '</i><i class="fa fa-thumbs-down" style="color: #c12267; font-size: 12px" aria-hidden="true"> ' + data[i].unlikes + '</i></div><br><p style="font-size:12px; padding-top:10px;padding-bottom:5px">' + data[i].description + '<br><img src="' + imageType + '"> &nbspat ' + address + '.</p></div>';
                        });
                    }
                    else {
                        feedBoxData = '<div><center><img src="http://i.imgur.com/KUsOXVu.png" style="padding-top:90px;" height="20%" width="20%"><br><br><p style="font-size:12px; color: #2f4f4f">Eh! It seems like you are the first one here :)<br>Start by searching for the place you would like to report for<br>and drop a status report!<br>or<br>Click on the help icon above to get started.</p></center></div>'
                    }
                    $("#feedBox").html(feedBoxData);
                }
            });
        };

        var interval = 5000;
        setInterval(reportFeeds, interval);

        function createStatusReports(MapPos, MapTitle, MapDesc, owner, InfoOpenDefault, DragAble, Removable, iconPath)
        {                
            var marker = new google.maps.Marker({
                position: MapPos,
                map: map,
                draggable:DragAble,
                animation: google.maps.Animation.DROP,
                icon: iconPath
            });

            var popwindow = new google.maps.InfoWindow();

            if(MapTitle != "New Location Status") {
                google.maps.event.addListener(marker, 'mouseover', function() {
                    popwindow.setContent('<div style="padding-left:20px;"><center><img src="https://t3.ftcdn.net/jpg/00/88/69/84/240_F_88698445_zHpZyrhMreVVWBs1WP3iLiTwidTfn4Jd.jpg" height="120px"></center><hr><b>Description:</b> ' + MapTitle + '</div>');
                    setTimeout(function() { popwindow.open(map, marker) }, 100);
                   
                });
                google.maps.event.addListener(marker, 'mouseout', function() {
                    setTimeout(function() { popwindow.close(map, marker) }, 450);
                });
            }
           
            var contentString = $('<div class="marker-info-win">'+
            '<div class="marker-inner-win"><span class="info-content">'+
            '<h1 class="marker-heading">'+MapTitle+'</h1>'+ MapDesc +
            '</span><button name="remove-marker" class="remove-marker" title="Remove Report">Remove Report</button>'+
            '</div></div>');

            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(contentString[0]);
            var statid = contentString.find('input.status-id')[0].value;
            var removeBtn   = contentString.find('button.remove-marker')[0];
            var saveBtn     = contentString.find('button.save-marker')[0];

            google.maps.event.addDomListener(removeBtn, "click", function(event) {
                deleteStatusMarkers(statid, marker);
            });
           
            if(typeof saveBtn !== 'undefined') {
                google.maps.event.addDomListener(saveBtn, "click", function(event) {
                    var mReplace = contentString.find('span.info-content');
                    var statid = contentString.find('input.status-id')[0].value;
                    var mName = contentString.find('input.save-name')[0].value;
                    var mType = contentString.find('select.save-type')[0].value;
                   
                    saveStatusReports(marker, mName, mType, statid, owner);
                });
            }
            
            google.maps.event.addListener(marker, 'click', function() {
                if(loggedInUser === owner) {
                    infowindow.open(map,marker);
                }
            });
             
            if(InfoOpenDefault)
            {
                infowindow.open(map,marker);
            }
        }

        function deleteStatusMarkers(statid, marker)
        {
    	    if(marker.getDraggable()) {
        		marker.setMap(null); //just remove new marker
                        map_initialize(map.getZoom(), map.getCenter());
    		} else {
		        var myData = { json_data: JSON.stringify({'csrfmiddlewaretoken': '{{csrf_token}}',
		        	'statid': statid })  };
		        $.ajax({
		          type: "POST",
		          url: "delete_status_reports",
		          data: myData,
		          success:function(data){
		                map_initialize(map.getZoom(), map.getCenter());
		            },
		          error:function (xhr, ajaxOptions, thrownError){
		              console.log("Something went wrong!");
		              alert(thrownError);
		            }
		        });
        	}
        }

        function saveStatusReports(Marker, mName, mType, statid, owner)
        {
        	var mLatLang = Marker.getPosition().toUrlValue();
        	if(statid != 'new') {
	            var myData = { json_data: JSON.stringify({'csrfmiddlewaretoken': '{{csrf_token}}',
	            	'name':mName,'latlang' : mLatLang, 'type' : mType, 'statid': statid})  };     
	            $.ajax({
	              type: "POST",
	              url: "update_status_reports",
	              data: myData,
	              success:function(data){
	                  map_initialize(map.getZoom(), map.getCenter());
	              },
	              error:function (xhr, ajaxOptions, thrownError){
	                  console.log("Something went wrong!");
	                  alert(thrownError);
	              }
	         });
            }
        	else {
                $.ajax({
                    type: 'GET',      
                    url:  'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + mLatLang + '&sensor=false',
                    dataType: 'json',
                    success: function(data) { 
                        var myData = { json_data: JSON.stringify({'csrfmiddlewaretoken': '{{csrf_token}}',
                            'name':mName,'latlang' : mLatLang, 'type' : mType, 'owner': owner, 'address': data.results[0].formatted_address})  };    
                        $.ajax({
                          type: "POST",
                          url: "save_new_status_reports",
                          data: myData,
                          success:function(data){
                                map_initialize(map.getZoom(), map.getCenter());
                            },
                            error:function (xhr, ajaxOptions, thrownError){
                                console.log("Something went wrong!")
                                alert(thrownError);
                            }
                        });
                    }
                });

        	}
        }

        var initialMapCenter = new google.maps.LatLng(22.9734, 80.6569);
        var map;
        var zoomLevel = 5; 
        map_initialize(zoomLevel, initialMapCenter);
        function map_initialize(zoomLevel, mapCenterValue)
        {
            statistics();
            reportFeeds();
            var googleMapOptions =
            {
                center: mapCenterValue,
                zoom: zoomLevel,
                panControl: true,
                zoomControl: true,
                zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
                },
                scaleControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
   
            map = new google.maps.Map(document.getElementById("google_map"), googleMapOptions);        
            var infWindow = new google.maps.InfoWindow({map: map});

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
    
                    infWindow.setPosition(pos);
                    infWindow.setContent('<center><p>Umm, found you :) Is there a problem<br> here ? Right click on the map and report now!</p><center>');
                    map.setCenter(pos);
                }, function() {
                    handleLocationError(true, infWindow, map.getCenter());
              });
            } 
            else {
                  handleLocationError(false, infWindow, map.getCenter());
            }
    
            var markerClusterOptions = {gridSize: 100, maxZoom: 15, imagePath: 'http://i.imgur.com/gMImCGV.png'};
            var marker_count=0;
            var allMarkerCoordinates=[];
            $.ajax({
                type: 'GET',      
                url:  'fetch_status_reports',
                dataType: 'json',
                success: function(data) { 
                	$.each(data, function(i, item) {
                        var name = data[i].description;
                     	var type = data[i].status;
                     	var id = data[i].id;
                     	var loc = data[i].coordinates.split(',');
                     	var point = new google.maps.LatLng(parseFloat(loc[0]),parseFloat(loc[1]));
                     	var temp = new google.maps.Marker({
                     	           position: point,
                     	           icon: 'http://i.imgur.com/K4uSMCP.png' });
                     	allMarkerCoordinates.push(temp);
                     	         
                     	var owner = data[i].owner;

                        imageType = '';

                		var clean = '';
                		var inprogress = '';
                		var severe = '';

                     	if(type == "Clean") {
                     		imageType = 'https://i.imgur.com/8jcjVUl.png';
                     		clean = 'selected';
                     	}
                     	else if(type == "In Progress") {
                     		imageType = 'https://i.imgur.com/TClWkgY.png';
                     		inprogress = 'selected';
                     	}
                     	else if(type == "Severe") {
                     		imageType = 'https://i.imgur.com/FXle0qD.png';
                     		severe = 'selected';
                     	}

                    var formData = '<p><div class="marker-edit">'+
               			'<form method="POST" name="SaveMarker" id="SaveMarker">'+
                		'<label for="pName"><span>Description: </span><input type="text" required name="pName" value="' + name +'"class="save-name" placeholder="" maxlength="40" /></label>&nbsp&nbsp'+
                		'<label for="pType"><span>Status: </span> <select name="pType" class="save-type"><option value="Clean"'+ clean +'>Clean</option><option value="In Progress"'+ inprogress +'>In Progress</option>'+
            			  '<option value="Severe"'+ severe +'>Severe</option></select></label>'+'<input type="hidden" name="status-id" class="status-id" value="' + id + '"/>'+
                		'</form>'+
                		'</div></p><button name="save-marker" class="save-marker">Save Location Status</button>';
                     	
                    createStatusReports(point, name, formData, owner, false, false, false, imageType);
					        });
					var markerCluster = new MarkerClusterer(map, allMarkerCoordinates,markerClusterOptions);        
                }                  
            });
            
            function handleLocationError(browserHasGeolocation, infWindow, pos) {
                infWindow.setPosition(pos);
                infWindow.setContent(browserHasGeolocation ?
                    'Unable to locate you due to slow connection.' :
                    'Please update your browser to use global positioning system.');
            }

            var input = document.getElementById('searchTextField');         
		        var autocomplete = new google.maps.places.Autocomplete(input, {
		        types: ["geocode"]
		    });          
		    
		    autocomplete.bindTo('bounds', map); 
		    var infowindow = new google.maps.InfoWindow(); 
		 
		    google.maps.event.addListener(autocomplete, 'place_changed', function() {
		        infowindow.close();
		        var place = autocomplete.getPlace();
		        if (place.geometry.viewport) {
		            map.fitBounds(place.geometry.viewport);
		        } else {
		            map.setCenter(place.geometry.location);
		            map.setZoom(17);  
		        }
		        
		        moveStatusPointer(place.name, place.geometry.location);
		    });  
		    
		    $("input").focusin(function () {
		        $(document).keypress(function (e) {
		            if (e.which == 13) {
		                infowindow.close();
		                var firstResult = $(".pac-container .pac-item:first").text();
		                var geocoder = new google.maps.Geocoder();
		                geocoder.geocode({"address":firstResult }, function(results, status) {
		                    if (status == google.maps.GeocoderStatus.OK) {
		                        var lat = results[0].geometry.location.lat(),
		                            lng = results[0].geometry.location.lng(),
		                            placeName = results[0].address_components[0].long_name,
		                            latlng = new google.maps.LatLng(lat, lng);
		                        moveStatusPointer(placeName, latlng);
		                        $("input").val(firstResult);
		                    }
		                });
		            }
		        });
		    });
		     
		    function moveStatusPointer(placeName, latlng) {
		        marker.setIcon(image);
		        marker.setPosition(latlng);
		        infowindow.setContent(placeName);
		        infowindow.open(map, marker);
        }

        google.maps.event.addListener(map, "click", function(event) {
            infWindow.close();
        });
        
        google.maps.event.addListener(map, 'rightclick', function(event) {
                        marker_count++;
                        if(marker_count==1) {
                            if(loggedInUser !== "AnonymousUser") {
                                $.ajax({
                                    type: 'GET',      
                                    url:  'http://ws.geonames.org/countryCodeJSON?lat=' + event.latLng.lat() + '&lng=' + event.latLng.lng() + '&username=mycleanindia',
                                    dataType: 'json',
                                    success: function(data) { 
                                        if(data.countryName == 'India') {
                                            var formData = '<p><div class="marker-edit">'+
                                            '<form method="POST" name="SaveMarker" id="SaveMarker">'+
                                            '<label for="pName"><span>Description: </span><input type="text" required name="pName" class="save-name" placeholder="" maxlength="40" /></label>&nbsp&nbsp'+
                                            '<label for="pType"><span>Status: </span> <select name="pType" class="save-type"><option value="Clean">Clean</option><option value="In Progress">In Progress</option>'+
                                            '<option value="Severe">Severe</option></select></label><input type="hidden" class="status-id" name="status-id" value="new"/>'+
                                            '</form>'+
                                            '</div></p><button name="save-marker" class="save-marker">Save Location Status</button>';

                                            createStatusReports(event.latLng, 'New Location Status', formData, loggedInUser, true, true, true, "https://i.imgur.com/HBBgM43.png");
                                        }
                                    }
                                });
                            }
                            else {
                                // TBD
                            }
                        }
                });   
            
    
            }
    });
});
