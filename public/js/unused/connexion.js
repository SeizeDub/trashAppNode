async function sendRequest() {
    let data = JSON.stringify(requestBody);
    let response = await fetch('/api/users/login', {method: "POST", body: data, headers: jsonHeaders()});
    response = await response.json();
    console.log(response);
}