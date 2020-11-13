[...document.querySelectorAll('input, textarea')].forEach(field => {
    initInfoElement(field);
});

function initInfoElement(field) {
    let infoElement = document.createElement('p');
    infoElement.classList.add('input-infos');
    infoElement.textContent = field.dataset.infos;
    field.after(infoElement);
    field.infoElement = infoElement;
}

/**
 * Returns custom error message if criteria are met
 * Returns default browser error message by default
 * @param {Node} field The field to retreive the error message from
 * @returns {string} Error message
 */
function getErrorMessage(field) {
    if (field.type === 'email' && field.validity.typeMismatch) {
        return 'Email invalide.'
    }
    return field.validationMessage;
}

/**
 * Adds invalid class to the input container
 * Displays message in the error element
 * @param {Node} field The field with error
 * @param {string} message The error message to display
 */
function displayError(field, message) {
    field.parentNode.classList.add('invalid');
    field.infoElement.textContent = message;
}

function removeError(field) {
    field.parentNode.classList.remove('invalid');
    field.infoElement.textContent = field.dataset.infos;
    field.setCustomValidity('');
}

function checkFileValidity(event) {
    let file = event.target.files[0];
    if (file.size > 10000000) {
        event.target.setCustomValidity('Fichier trop volumineux.');
    } else {
        event.target.infoElement.textContent = file.name;
    }
}

/**
 * Checks field validity on change
 */
document.addEventListener('change', event => {
    if (event.target.type === 'file') {
        checkFileValidity(event);
    }
    event.target.reportValidity();
});

/**
 * Display error message on invalid field
 */
document.addEventListener('invalid', event => {
    event.preventDefault();
    displayError(event.target, getErrorMessage(event.target));
}, true);

/**
 * Removes invalid class and error message on input
 */
document.addEventListener('input', event => {
    removeError(event.target);
});

///////////////////////////////////////////


let step = 0;
let formEls = document.getElementsByTagName('form');
let maxStep = formEls.length - 1;
let requestBody = new FormData();

document.onsubmit = (event) => {
    event.preventDefault();
    addDataToRequestBody(event.target);
    if (step === maxStep) {
        sendRequest(requestBody);
    } else {
        changeStep(+1);
    }
}

function addDataToRequestBody(form) {
    let formData = new FormData(form);
    for (let [key, value] of formData) {
        requestBody.set(key, value);
    }
}

function changeStep(increment) {
    formEls[step].classList.remove('active');
    step += increment;
    formEls[step].classList.add('active');
    formEls[step].getElementsByTagName('input')[0].focus();
}

document.addEventListener('click', event => {
    if (event.target.classList.contains('previous-step')) {
        changeStep(-1);
    }
});



function goToStep(stepNumber, field = null) {
    step = stepNumber;
    [...document.getElementsByTagName('form')].forEach((element, index) => {
        if (step === index) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
    field?.focus();
}



function jsonHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return headers;
}

function multipartHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "multipart/form-data; boundary=something");
    return headers;
}

async function sendRequest() {
    let response = await fetch('/api/request/create', {method: 'POST', body: requestBody});
    response = await response.json();
    if (response.message === 'success') {
        window.location.replace('/success');
        return;
    }
    if (response.error) return console.log(response.error);
    //handle later
}

document.getElementsByTagName('input')[0].focus();