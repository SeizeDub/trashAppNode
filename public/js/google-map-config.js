let inputAddress = document.getElementById('input-address');
let inputLat = document.getElementById('input-lat');
let inputLng = document.getElementById('input-lng');
let mapElement = document.getElementById('map');

async function initGoogleMaps() {
    metropolygon = await getMetropolygon();
    autocomplete = initAutocomplete();
    initAutocompleteListeners();
    if (mapElement) {
        map = initMap();
        metropolygon.setMap(map);
        geocoder = new google.maps.Geocoder;
        marker = initMarker();
        initMarkerListener()
        if (navigator.geolocation) {
            initGeolocation();
        }
    }
}

function initGeolocation() {
    let geolocationEl = document.createElement('div');
    geolocationEl.id = 'geolocation';
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(geolocationEl);

    geolocationEl.onclick = () => {
        navigator.geolocation.getCurrentPosition(position => {
            position = {lat: position.coords.latitude, lng: position.coords.longitude};
            geocoder.geocode({'location': position}, results => validatePlace(results[0]));
        });
    }
}

function initMarker() {
    return new google.maps.Marker({
        draggable: true,
        icon : {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            fillColor: '#52bd74',
            fillOpacity: 1,
            strokeColor: '#52bd74',
            strokeWeight: 3,
            scale: 1.5,
        }
    });
}

function initMarkerListener() {
    marker.addListener('dragend', () => {
        position = {lat : marker.getPosition().lat(), lng : marker.getPosition().lng()};
        geocoder.geocode({'location': position}, results => validatePlace(results[0]));
    });
}

function initMap() {
    return new google.maps.Map(document.getElementById('map'), {
        center: {lat: 44.85, lng: -0.58},
        zoom: 14,
        disableDefaultUI: true,
        fullscreenControl: true
    });
}


function initAutocomplete() {
    return new google.maps.places.Autocomplete(inputAddress, {
        bounds : getPolygonBounds(metropolygon),
        strictBounds : true, 
        componentRestrictions : {country : "fr"},
        fields : ["address_components", "formatted_address", "geometry"],
        types : ["address"]
    });
}

function initAutocompleteListeners() {
    inputAddress.addEventListener('change', event => validatePlace(event.target.value));
    autocomplete.addListener('place_changed', () => validatePlace(autocomplete.getPlace()));
}

function validatePlace(place) {
    if (place === undefined || !place.address_components || place.address_components[0].types[0] !== "street_number") {
        inputAddress.setCustomValidity("Veuillez renseigner une adresse de domicile valide.");
        inputAddress.reportValidity();
        return
    }
    inputAddress.value = place.formatted_address;
    let placeLat = place.geometry.location.lat();
    let placeLng = place.geometry.location.lng()
    let placeLatLng = new google.maps.LatLng(placeLat, placeLng);
    if (mapElement) {
        updateMarker(placeLatLng);
    }
    if (!google.maps.geometry.poly.containsLocation(placeLatLng, metropolygon)) {
        inputAddress.setCustomValidity("Veuillez sélectionner une adresse dépendante de Bordeaux Métropole.");
        inputAddress.reportValidity();
        return
    }
    removeError(inputAddress);
    inputLat.value = parseFloat(placeLat);
    inputLng.value = parseFloat(placeLng);
}

function updateMarker(pos) {
    marker.setMap(map);
    marker.setPosition(pos);
    map.setCenter(pos);
}

async function getMetropolygon() {
    let response = await fetch('/json/metropolygon.json');
    let data = await response.json();
    return new google.maps.Polygon({
        paths: data,
        strokeColor: '#52bd74',
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: '#52bd74',
        fillOpacity: 0
    });
}

function getPolygonBounds(polygon) {
	let bounds = new google.maps.LatLngBounds();
	polygon.getPath().forEach(point => bounds.extend(point));
	return bounds;
}















