
var map;
var markers = [];

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
	markers.push(new google.maps.Marker(
	{
		position: aarhus,
		map: map
	}));
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

function saveWater(key, locationData, ph, bacteria)
{
	firebase.database().ref('data/' + key).set(
	{
		location: locationData,
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

function createQuery(centerPos, radiusKm)
{
	var geoQuery = geoFire.query(
	{
		center: centerPos,
		radius: radiusKm
	});
	
	geoQuery.on("key_entered", function(key, location, distance)
	{
		console.log("Spot: " + key + " found at " + location + " (" + distance + " km away)"); 
	}
	);
}

function getAllDataPoints()
{
	var datapoints = [];
}

function addMarker(location, name)
{
	
}
