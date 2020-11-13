let mapElement = document.getElementById('map');

async function initGoogleMaps() {
    metropolygon = await getMetropolygon();
    map = initMap();
    metropolygon.setMap(map);
    encombrants.forEach(encombrant => initMarker('encombrant', encombrant));
    depots.forEach(depot => initMarker('depot', depot));
}

document.onclick = (event) => {
    if (event.target.classList.contains('admin-task-button') && !event.target.classList.contains('active')) {
        [...document.getElementsByClassName('admin-task-container')].forEach(element => {
            element.classList.toggle('active');
        });
        [...document.getElementsByClassName('admin-task-button')].forEach(element => {
            element.classList.toggle('active');
        });
        let buttonTask = event.target.dataset.task;
        if (buttonTask === 'encombrant') {
            encombrants.forEach(encombrant => encombrant.marker.setMap(map));
            depots.forEach(depot => depot.marker.setMap(null));
        } else if (buttonTask === 'depot') {
            encombrants.forEach(encombrant => encombrant.marker.setMap(null));
            depots.forEach(depot => depot.marker.setMap(map));
        }
    }
}

function initMarker(task, request) {
    request.marker = new google.maps.Marker({
        map: task === 'encombrant' ? map : null,
        position: {lat: request.address.lat, lng: request.address.lng},
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


function initMap() {
    return new google.maps.Map(document.getElementById('map'), {
        center: {lat: 44.85, lng: -0.58},
        zoom: 12,
        disableDefaultUI: true,
        fullscreenControl: true
    });
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