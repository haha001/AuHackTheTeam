
var map;
var markers = [];
var infoWindow; 


firebase.initializeApp({
	apiKey: "AIzaSyAx67v4mGr7qE4qSkbI0snWMFayDGeI6do",
	databaseURL: "https://flaskplay.firebaseio.com/"
});

// Get reference to firebase location
var locationRef = firebase.database().ref('locations/');
var dataRef = firebase.database().ref('data/');

// Create a new GeoFire instance at the random Firebase location
var geoFire = new GeoFire(locationRef);


function initMap()
{
	var aarhus = {lat: 56.162939, lng: 10.203921};
	map = new google.maps.Map(document.getElementById('map'),
	{
		zoom: 12,
		center: aarhus
	});
	infoWindow = new google.maps.InfoWindow(
	{
		content: 'Hello World'
	});

}
	

function saveWater(key, ph, bacteria, leadLevel, dirt, waterIndex)
{
	firebase.database().ref('data/' + key).set(
	{
		leadLevel: leadLevel,
		ph: ph,
		bacteria: bacteria,
		waterIndex: waterIndex,
		dirtLevel: dirt
	});
}

function saveLocation(key, value)
{
	geoFire.set(key, value).then(function()
	{
		console.log("Provided key has been added to GeoFire");
		
	}, function(error)
	{
		console.log("Error: " + error);
	});
}

function createQuery(searchKey, distance)
{
	geoFire.get(searchKey).then(function(location) {
		if (location === null) {
			console.log("Provided key is not in GeoFire");
		}
		else {
			console.log("Provided key has a location of " + location);
			var geoQuery = geoFire.query(
			{
				center: location,
				radius: distance
			});
			
			geoQuery.on("key_entered", function(key, location, distance)
			{
				dataRef.child(key).once('value').then(function (snapshot)
				{
					printWater(snapshot, location);
				});				
			});
		}
		}, function(error) {
			console.log("Error: " + error);
	});	
}

function printWater(snapshot, location)
{

		
		var key = snapshot.key;
		var ph = snapshot.child('ph').val();
		var leadLevel = snapshot.child('leadLevel').val();
		var bacteria = snapshot.child('bacteria').val();
		var dirtLevel = snapshot.child('dirtLevel').val();
		var waterIndex = snapshot.child('waterIndex').val();
		
		var contentString = getContentString(snapshot);
		
		var lng = Number(location[0]);
		var lat = Number(location[1]);
		var loc = {lat: lat, lng: lng};
		
		if (waterIndex == 100)
		{
			
			addMarker(loc,'green', contentString);
		}
		else
		{
			
			addMarker(loc,'red', contentString);
		}
		
		console.log("id: " + key + " pH level: " + ph + " leadLevel: " + leadLevel + " bacteria: " + bacteria);
}

function getContentString(snapshot)
{
	var key = snapshot.key;
	var ph = snapshot.child('ph').val();
	var leadLevel = snapshot.child('leadLevel').val();
	var bacteria = snapshot.child('bacteria').val();
	var dirtLevel = snapshot.child('dirtLevel').val();
	var waterIndex = snapshot.child('waterIndex').val();
	//<div id="waterIndexOutside"><div id="waterIndexInside"></div></div>
	
	
	return '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading"> <progress id="waterIndexSlider" value="' + waterIndex + '" max="100"></progress> Water index: '+ waterIndex + '</h1>' +
		'<div id="bodyContent">'+
		'<div id="waterContent">'+
		'<table width=100%>' +
		'<tr>' +
		'<td><strong>pH: </strong> ' + ph + '</td>' +
		'<td><strong>lead: </strong> ' + leadLevel + 'ppm</td>' +
		'</tr>' +
		'<tr>' +
		'<td><strong>bacteria: </strong>' + bacteria + '</td>' +
		'<td><strong>dirt: </strong>' + dirtLevel + 'ppm</td>' +
		'</tr>' +
		'</table>'+
		'</div>'+
		'</div>'+
		'</div>';
	
}

function getAllDataPoints()
{
	var datapoints = [];
}

function addMarker(location, color, content)
{
	
	if (color == 'green')
	{
		var pinIcon = new google.maps.MarkerImage(
			"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00FF00",
			null, /* size is determined at runtime */
			null, /* origin is 0,0 */
			null, /* anchor is bottom center of the scaled image */
			new google.maps.Size(32, 50)
		);  
		var marker = new google.maps.Marker(
		{
			position: location,
			map: map,
			//icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
			icon: pinIcon,
		}
		);
	}
	else
	{
		var pinIcon = new google.maps.MarkerImage(
			"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF0000",
			null, /* size is determined at runtime */
			null, /* origin is 0,0 */
			null, /* anchor is bottom center of the scaled image */
			new google.maps.Size(32, 50)
		);  
		var marker = new google.maps.Marker(
		{
			position: location,
			map: map,
			icon: pinIcon
		}
		);
	}

	
	
	google.maps.event.addListener(marker,'click', function(e)
	{
		infoWindow.setContent(content);
		infoWindow.open(map, this);
	});
	markers.push(marker);
	//showMarkers();
}

function deleteMarkers()
{
	for (var i = 0; i < markers.length; i++)
	{
		markers[i].setMap(null);
	}
	markers = [];
}

function showMarkers()
{
	for (var i = 0; i < markers.length; i++)
	{
		markers[i].setMap(map);
	}
}