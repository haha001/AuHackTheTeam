
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
		zoom: 4,
		center: aarhus
	});
	infoWindow = new google.maps.InfoWindow(
	{
		content: 'Hello World'
	});

}
	
function loadDb(key)
{
	// Create a GeoQuery centered at fish2 u1zr80nk8
	geoFire.get(key).then(function(location) {
		alert(location)
		if (location === null) {
			console.log("Provided key is not in GeoFire");
		}
		else {
			console.log("Provided key has a location of " + location + " with pH: " + ph);
		}
		}, function(error) {
			console.log("Error: " + error);
	});
}

function saveWater(key, ph, bacteria, leadLevel)
{
	firebase.database().ref('data/' + key).set(
	{
		leadLevel: leadLevel,
		ph: ph,
		bacteria: bacteria
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
		//var location = snapshot.child('location').val();
		
		var contentString = getContentString(snapshot);
		
		var lng = Number(location[0]);
		var lat = Number(location[1]);
		var loc = {lat: lat, lng: lng};
		
		if (ph > 6.5 && ph < 8)
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
		'</div>';
	
	return '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading"> <progress id="waterIndexSlider" value="' + waterIndex + '" max="100"></progress> Water index: '+ waterIndex + '</h1>' +
		'<div id="bodyContent">'+
		'<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
		'sandstone rock formation in the southern part of the '+
		'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
		'south west of the nearest large town, Alice Springs; 450&#160;km '+
		'(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
		'features of the Uluru - Kata Tjuta National Park. Uluru is '+
		'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
		'Aboriginal people of the area. It has many springs, waterholes, '+
		'rock caves and ancient paintings. Uluru is listed as a World '+
		'Heritage Site.</p>'+
		'<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
		'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
		'(last visited June 22, 2009).</p>'+
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
		var marker = new google.maps.Marker(
		{
			position: location,
			map: map,
			icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
		}
		);
	}
	else
	{
		var marker = new google.maps.Marker(
		{
			position: location,
			map: map
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