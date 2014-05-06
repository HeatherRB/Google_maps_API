
///////////////////////////////////////////////////////////////
// SCRIPT DATA
///////////////////////////////////////////////////////////////

// city constructor function and data
function City(name,lat,lon,pic) {
    this.name = name;
    this.lat = lat;
    this.lon = lon;
    this.latLng = new google.maps.LatLng(lat, lon);
    this.pic = pic;
}
var places = {};
    places.Banff = new City('Banff', 51.18, -115.57, true);
    places.Beijing = new City('Beijing', 39.91, 116.39, true);
    places.Berlin = new City('Berlin', 52.51, 13.38, true);
    places.Boston = new City('Boston', 42.35, -71.06, true);
    places.Brighton = new City('Brighton', 50.84, 0.13, true);
    places.Calais = new City('Calais', 50.95, 1.85, true);
    places.CambridgeMA = new City('Cambridge MA', 42.37, -71.11, true);
    places.Dover = new City('Dover', 51.13, 1.31, true);
    places.Exmoor = new City('Exmoor', 51.1, -3.6, true);
    places.Florence = new City('Florence', 43.78, 11.25, true);
    places.GreatSouthernTouringRoute = new City('Great Southern Touring Route', -38.66, 143.10, true);
    places.Kunming = new City('Kunming', 25.06, 102.68, true);
    places.LakeDistrict = new City('Lake District', 54.53, -3.14,true);
    places.London = new City('London', 51.53, -0.07, false);
    places.Lucca = new City('Lucca',43.85, 10.51, true);
    places.Melbourne = new City('Melbourne', -37.81, 144.96, true);
    places.NewYork = new City('New York', 40.67, -73.94, true);
    places.Oxford = new City('Oxford', 51.75, -1.25, true);
    places.Paris = new City('Paris', 48.85, 2.35, true);
    places.PeakDistrict = new City('Peak District', 53.35, -1.83, true);
    places.Providence = new City('Providence', 41.82, -71.42, true);
    places.Quimper = new City('Quimper', 47.99, -4.09, true);
    places.Rome = new City('Rome', 41.9, 12.5, true);
    places.Shanghai = new City('Shanghai', 31.2, 121.5, true);
    places.Stockholm = new City('Stockholm', 59.32, 18.06, true);
    places.Sydney = new City('Sydney', -33.86, 151.21, true);
    places.Tasmania = new City('Tasmania', -42.12, 148.29, true);
    places.TigerLeapingGorge = new City('Tiger Leaping Gorge', 27.23, 100.13, true);
    places.Toronto = new City('Toronto', 43.7, -79.4, false);
    places.Tuscany = new City('Tuscany', 42.55, 11.13, true);
    places.Warsaw = new City('Warsaw', 52.23, 21.01, true);

// journey constructor function and data
// transport: 0=plane, 1=train, 2=car, 3=boat
function Journey(startCity,endCity,transport) {
    this.startCity = startCity;
    this.endCity = endCity;
    this.transport = transport;
}
var trips = [
             new Journey('London','Banff',0),
             new Journey('London','Beijing',0),
             new Journey('London','Berlin',0),
             new Journey('London','Boston',0),
             new Journey('London','Brighton',1),
             new Journey('Dover','Calais',3),
             new Journey('Boston','CambridgeMA',1),
             new Journey('London','Dover',2),
             new Journey('London','Exmoor',1),
             new Journey('London','Florence',0),
             new Journey('Melbourne','GreatSouthernTouringRoute',2),
             new Journey('Shanghai','Kunming',0),
             new Journey('London','LakeDistrict',2),
             new Journey('Florence','Lucca',1),
             new Journey('Sydney','Melbourne',1),
             new Journey('Providence', 'NewYork',1),
             new Journey('London','Oxford',2),
             new Journey('London','Paris',1),
             new Journey('London','PeakDistrict',2),
             new Journey('London','Providence',0),
             new Journey('Calais','Quimper',2),
             new Journey('Paris','Rome',1),
             new Journey('Beijing','Shanghai',1),
             new Journey('London','Stockholm',0),
             new Journey('Beijing','Sydney',0),
             new Journey('Sydney','Tasmania',0),
             new Journey('Kunming','TigerLeapingGorge',2), 
             new Journey('London','Toronto',0),
             new Journey('London','Tuscany',0),
             new Journey('Berlin','Warsaw',1)
];

// icons and colours corresponding to methods of transport
function Icon(url) {
    this.url = url;
    this.size = null;
    this.origin = new google.maps.Point(0,0);
    this.anchor = new google.maps.Point(10,10);
    this.scaledSize = new google.maps.Size(20,20)
    }
var plane = new Icon('Graphics/plane.png');
var train = new Icon('Graphics/train.png');
var car = new Icon('Graphics/car.png');
var boat = new Icon('Graphics/boat.png');
var icons = [plane,train,car,boat];
// plane = orange, train = green, car = black, boat = blue
var colours = ['#FF6600','#009900','#000000','#0066FF'];


///////////////////////////////////////////////////////////////
// MAIN FUNCTION
///////////////////////////////////////////////////////////////

google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
    var mapOptions = {
    center: places.London.latLng,
    zoom: 4,
    draggable: true
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    var infoWindow = new google.maps.InfoWindow();
    setMarkers(map, infoWindow, trips, places);
}


///////////////////////////////////////////////////////////////
// MARKERS AND LINES
///////////////////////////////////////////////////////////////

// draw markers and lines for journeys
function setMarkers(map, infoWindow, trips, places) {
    
    // take each journey...
    for (var i = 0; i < trips.length; i++) {
        var journey = trips[i];
        
        // set the route
        var origin = places[journey.startCity];
        var destination = places[journey.endCity];
        var routeCoordinates = [origin.latLng, destination.latLng];
        
        // plot route
        var routePath = new google.maps.Polyline({
                    path: routeCoordinates,
                    map: map,
                    geodesic: true,
                    strokeColor: colours[journey.transport],
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
        });
        
        // plot destination marker
        var marker = new google.maps.Marker({
                    position: destination.latLng,
                    map: map,
                    title: destination.name,
     //               icon: routeIcon,
                    draggable: false
        });
        
        // set the contents of the InfoWindow
        if (destination.pic) {
            var imageString = '<img src="Travel_diary/' + destination.name.replace(/\s+/g, '') + '.jpg"' +
            'width="240" height="240">'
        } else {
            var imageString = ' '
        }
        var contentString = '<div id="content" style="text-align: left">' +
        '<img src="' + icons[journey.transport].url + '" width="20" height="20">' +
        '<b>  ' + origin.name + ' to ' + destination.name +
        '</b><br>' +
        'Start coordinates: (' + origin.lat + ', ' + origin.lon + ')<br>' +
        'Destination coordinates: (' + destination.lat + ', ' + destination.lon + ')<br>' +
        'Distance: ' + distance(origin.lat, origin.lon, destination.lat, destination.lon) + ' miles&#42;' +
        '<br>' + imageString + '</div>';
        
        // display the InfoWindow when the user clicks on either the path or the destination marker
        google.maps.event.addListener(marker,'click', (function(marker,contentString){
                    return function() {
                        if (infoWindow) {
                            infoWindow.close();
                        }
                        infoWindow.setContent(contentString);
                        infoWindow.open(map,marker);
                    };
        })(marker,contentString));
        google.maps.event.addListener(routePath,'click', (function(marker,routePath,contentString){
                    return function() {
                        if (infoWindow) {
                            infoWindow.close();
                        }
                    infoWindow.setContent(contentString);
                    infoWindow.open(map,marker);
                    };
        })(marker,routePath,contentString));

    }
}

// calculate the distance as the crow flies from one city to another
function distance(lat1, lon1, lat2, lon2) {
    
    var theta1, theta2; // the polar angles of the two points in radians
    var phi1, phi2; // the aximuthal angles of the two points in radians
    var psi = 1.0; // angle between the two points (lat1,lon1) and (lat2,lon2)
    var radius = 3963.1676; // radius of the earth in miles
    
    // calculates distance = r*psi
    theta1 = Math.PI*lat1/180;
    theta2 = Math.PI*lat2/180;
    phi1 = Math.PI*lon1/180;
    phi2 = Math.PI*lon2/180;
    psi = Math.acos(Math.sin(theta1)*Math.sin(theta2) + Math.cos(theta1)*Math.cos(theta2)*Math.cos(phi1-phi2));
    return (radius*psi).toFixed(0);
}