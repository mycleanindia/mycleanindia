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

        $(".rotate").click(function(){
            $(this).toggleClass("down"); 
            map_initialize();
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
                    popwindow.close();
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
                        map_initialize();
    		} else {
		        var myData = { json_data: JSON.stringify({'csrfmiddlewaretoken': '{{csrf_token}}',
		        	'statid': statid })  };
		        $.ajax({
		          type: "POST",
		          url: "delete_status_reports",
		          data: myData,
		          success:function(data){
		                map_initialize();
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
	                    map_initialize();
	                },
	                error:function (xhr, ajaxOptions, thrownError){
	                	console.log("Something went wrong!");
	                    alert(thrownError);
	                }
	            });
        	}
        	else {
	            var myData = { json_data: JSON.stringify({'csrfmiddlewaretoken': '{{csrf_token}}',
	            	'name':mName,'latlang' : mLatLang, 'type' : mType, 'owner': owner})  };    
	            $.ajax({
	              type: "POST",
	              url: "save_new_status_reports",
	              data: myData,
	              success:function(data){
	                    map_initialize();
	                },
	                error:function (xhr, ajaxOptions, thrownError){
	                	console.log("Something went wrong!")
	                    alert(thrownError);
	                }
	            });
        	}
        }

        var mapCenter = new google.maps.LatLng(28.6139, 77.2090);
        var map;

        map_initialize();
        function map_initialize()
        {
            statistics();
            var googleMapOptions =
            {
                center: mapCenter,
                zoom: 5,
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
            } else {
                  handleLocationError(false, infWindow, map.getCenter());
            }

            var marker_count=0;

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
            $.ajax({
                type: 'GET',      
                url:  'http://ws.geonames.org/countryCodeJSON?lat=' + event.latLng.lat() + '&lng=' + event.latLng.lng() + '&username=mycleanindia',
                dataType: 'json',
                success: function(data) { 
                    if(data.countryName == 'India') {
                        marker_count++;
                        if(marker_count==1) {
                            if(loggedInUser !== "AnonymousUser") {
                                var formData = '<p><div class="marker-edit">'+
                                '<form method="POST" name="SaveMarker" id="SaveMarker">'+
                                '<label for="pName"><span>Description: </span><input type="text" required name="pName" class="save-name" placeholder="" maxlength="40" /></label>&nbsp&nbsp'+
                                '<label for="pType"><span>Status: </span> <select name="pType" class="save-type"><option value="Clean">Clean</option><option value="In Progress">In Progress</option>'+
                                '<option value="Severe">Severe</option></select></label><input type="hidden" class="status-id" name="status-id" value="new"/>'+
                                '</form>'+
                                '</div></p><button name="save-marker" class="save-marker">Save Location Status</button>';

                                createStatusReports(event.latLng, 'New Location Status', formData, loggedInUser, true, true, true, "https://i.imgur.com/HBBgM43.png");
                            }
                            else {
                                $('#myAccount').modal('toggle');
                                $('#myAccount').modal('show');
                            }
                        }
                    }
                }
            });
        });                            
      }
    });
});
