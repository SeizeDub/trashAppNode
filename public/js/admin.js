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
        changeTask(event);
    } else if (event.target.classList.contains('delete-request')) {
        deleteRequest(event);
    } else if (event.target.classList.contains('delete-comment')) {
        deleteComment(event);
    } else if (event.target.classList.contains('show-details')) {
        displayDetails(event);
    } else if (event.target.classList.contains('address')) {
        centerMap(event);
    }
}

document.onsubmit = (event) => {
    event.preventDefault();
    createComment(event);
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

function centerMap(event) {
    let id = event.target.parentNode.dataset.id;
    [...encombrants, ...depots].forEach(request => {
        if (request._id === id) {
            map.setCenter(request.marker.getPosition());
        }
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

function displayDetails(event) {
    let id = event.target.parentNode.dataset.id;
    event.target.parentNode.getElementsByClassName('details')[0].classList.toggle('active');
    event.target.textContent === '+' ? event.target.textContent = '-' : event.target.textContent = '+';
}

function changeTask(event) {
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

async function deleteRequest(event) {
    let id = event.target.dataset.id;
    let response = await fetch('/admin/' + id, {method: 'delete', headers: jsonHeaders()});
    response = await response.json();
    if (response.message === 'success') {
        [...document.getElementsByClassName('task-article')].find(article => article.dataset.id === id).remove();
        [...encombrants, ...depots].forEach(request => {
            if (request._id === id) {
                request.marker.setMap(null);
            }
        })
    }
}

async function createComment(event) {
    let id = event.target.dataset.id;
    let data = {commentContent: event.srcElement[0].value};
    let response = await fetch('/admin/' + id, {method: 'PATCH', body: JSON.stringify(data), headers: jsonHeaders()});
    if (response.status === 200) {
        response = await response.json();
        event.target.reset();
        let commentid = response.comment._id;
        displayComment(response, id, commentid);
    }
}

async function deleteComment(event) {
    let id = event.target.dataset.id;
    let commentId = event.target.dataset.commentid;
    let response = await fetch(`/admin/${id}/${commentId}`, {method: 'PATCH', headers: jsonHeaders()});
    response = await response.json();
    if (response.message === 'success') {
        let task = [...document.getElementsByClassName('task-article')].find(article => article.dataset.id === id);
        [...task.getElementsByClassName('comment')].find(comment => comment.dataset.commentid === commentId).remove();
    }
}

function jsonHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return headers;
}

function displayComment(response, id, commentid) {
    let task = [...document.getElementsByClassName('task-article')].find(article => article.dataset.id === id);
    let commentsContainer = task.getElementsByClassName('comments')[0];

    let comment = document.createElement('article');
    comment.classList.add('comment');
    comment.dataset.id = id;
    comment.dataset.commentid = commentid;

    let commentContent = document.createElement('p');
    commentContent.textContent = response.comment.content;

    let commentDate = document.createElement('span');
    commentDate.classList.add('commentDate');
    let date = new Date(response.comment.createdAt);
    commentDate.textContent = date.toLocaleDateString('fr-FR').split('-').reverse().join('/') + ' à ' + date.toLocaleTimeString('fr-FR').split(':').slice(0,-1).join('h');

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-comment');
    deleteButton.textContent = 'X';
    deleteButton.dataset.id = id;
    deleteButton.dataset.commentid = commentid;

    comment.appendChild(deleteButton);
    comment.appendChild(commentDate);
    comment.appendChild(commentContent);

    commentsContainer.appendChild(comment);
}