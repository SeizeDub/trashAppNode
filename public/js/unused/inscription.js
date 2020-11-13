async function sendRequest() {
    let data = JSON.stringify(requestBody);
    let response = await fetch('/api/users/register', {method: "POST", body: data, headers: jsonHeaders()});
    response = await response.json();
    if (response?.error?.errors?.email?.kind === 'unique') {
        goToStep(0);
        let inputEmail = document.getElementById('input-email');
        inputEmail.setCustomValidity('Cette adresse e-mail est déjà utilisée.');
        inputEmail.reportValidity();
    }
}