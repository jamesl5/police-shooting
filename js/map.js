

// Function to draw your map
var drawMap = function() {

  // Create map and set view
	var map = L.map("container").setView([39.82, -98.58], 4);

  // Create a tile layer variable using the appropriate url
	var layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18,
		id: 'jamesl5.no7ibcoe',
		accessToken: 'pk.eyJ1IjoiamFtZXNsNSIsImEiOiJjaWZ3eWk5dzEzaW9sdXVtMnh3NDEyZzFpIn0.ZWjXQxwisXRGmlIo4tNmcA'
	});
	
  // Add the layer to your map
	layer.addTo(map);

  // Execute your function to get data
	getData(map);
}


// Function for getting data
var getData = function(map) {

  // Execute an AJAX request to get the data in data/response.js
	var data;
	$.ajax({ 
		type: 'GET', 
		url: 'data/response.json', 
		dataType: 'json',
		success: function (dat) { 
			data = dat;
			customBuild(map, data);
		}
	});

  // When your request is successful, call your customBuild function
	
}

// Loop through your data and add the appropriate layers and points
var customBuild = function(map, data) {
	// Be sure to add each layer to the map
	//layer group instances
	var unknown = new L.LayerGroup([]);
	var unarmed = new L.LayerGroup([]);
	var handgun = new L.LayerGroup([]);
	var shotgun = new L.LayerGroup([]);
	var unknownFirearm = new L.LayerGroup([]);
	var rifle = new L.LayerGroup([]);
	var otherGun = new L.LayerGroup([]);
	var bluntObject = new L.LayerGroup([]);
	var knife = new L.LayerGroup([]);
	var vehicle = new L.LayerGroup([]);
	var nonLethal = new L.LayerGroup([]);
	var others = new L.LayerGroup([]);
	var latitude;
	var longitude;
	var weapon;
	var result;
	//arrays for storing counts of data
	//index 0 is men, index 1 is women
	var arm = [0, 0];
	var unarm = [0, 0];
	//for each incident in data..
	data.forEach (function(incident){
		latitude = incident.lat;
		longitude = incident.lng;
		weapon = incident.Weapon;
		//create a circle with colors
		var circle = new L.circle([latitude, longitude], 300, {
			color : resultColor(incident),
			fillColor : resultColor(incident),
			fillOpacity : 0.5
		});
		//Popup window
		circle.bindPopup(incident.Summary);
		//add each circle according to its group and increment the counts
		if(weapon == "Blunt object (clubs, hammers, etc.)"){
			circle.addTo(bluntObject);
			arm[checkGender(incident)]++;
		} else if(weapon == "Firearm; not stated"){
			circle.addTo(unknownFirearm);
			arm[checkGender(incident)]++;
		} else if (weapon == "Handgun"){
			circle.addTo(handgun);
			arm[checkGender(incident)]++;
		} else if (weapon == "Knife or cutting instrument"){
			circle.addTo(knife);
			arm[checkGender(incident)]++;
		} else if (weapon == "Other Gun"){
			circle.addTo(otherGun);
			arm[checkGender(incident)]++;
		} else if (weapon == "Rifle" || weapon == "Assault Rifle"){
			circle.addTo(rifle);
			arm[checkGender(incident)]++;
		} else if (weapon == "Shotgun"){
			circle.addTo(shotgun);
			arm[checkGender(incident)]++;
		} else if (weapon == "Toy/fake/non-lethal gun"){
			circle.addTo(nonLethal);
			unarm[checkGender(incident)]++;
		} else if (weapon == "Personal weapon (hands, fists, feet, etc.)" || weapon == "Unarmed"){
			circle.addTo(unarmed);
			unarm[checkGender(incident)]++;
		} else if (weapon == "Unknown"){
			circle.addTo(unknown);
			unarm[checkGender(incident)]++;
		} else if (weapon == "Car" || weapon == "Car?" || weapon == "driving a car" || weapon == "Vehicle"){
			circle.addTo(vehicle);
			unarm[checkGender(incident)]++;
		} else {
			circle.addTo(others);
			unarm[checkGender(incident)]++;
		}
	});
	//when everything is loaded, add a table with stats
	$(document).ready(function() {
		$("#table1").append(
		"<table class = 'table table-striped'>"+
		"<tr><td></td><td class = 'title'>Men</td><td class = 'title'>Women/unspecified</td></tr>"+
		"<tr><td class = 'title'>Armed</td><td>"+ arm[0] +"</td><td>" + arm[1] +" </td></tr>" +
		"<tr><td class = 'title'>Unarmed/unspecified</td><td>"+ unarm[0] +"</td><td>"+ unarm[1] +"</td></tr></table>");
	});
	//List of layer groups
	var layers = {
		"Blunt object (clubs, hammers, etc.)" : unknown,
		"Knife or cutting instrument" : knife,
		"Handgun" : handgun,
		"Rifle" : rifle,
		"Shotgun" : shotgun,
		"Other Gun" : otherGun,
		"Unknown Firearm" : unknownFirearm,
		"Vehicle" : vehicle,
		"Unarmed" : unarmed,
		"Non-lethal Weapon" : nonLethal,
		"Others" : others
	}
	//add control
	L.control.layers(null,layers).addTo(map);
}

//function for choosing color
var resultColor = function(incident){
	var result = incident['Hit or Killed?'];
	if(result == "Killed"){
		return "red"
	} else if (result == "Hit"){
		return "yellow"
	} else {
		return "gray"
	}
}

//function for checking gender
var checkGender = function(incident){
	var gender = incident["Victim's Gender"];
	if(gender == "Male"){
		return 0;
	} else {
		return 1;
	}
	
}



