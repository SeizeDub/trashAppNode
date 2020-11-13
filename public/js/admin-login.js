document.onsubmit = (event) => {
    event.preventDefault();
    let adminPassword = document.getElementById('input-adminPassword').value;
    sendRequest(adminPassword);
}

async function sendRequest(adminPassword) {
    let response = await fetch('/admin/login', {method: 'POST', body: adminPassword});
    // response = await response.json();
    // if (response.message === 'success') {
    //     window.location.replace('/admin');
    //     return;
    // }
    // if (response.error) return console.log(response.error);
    // //handle later
}

function jsonHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return headers;
}