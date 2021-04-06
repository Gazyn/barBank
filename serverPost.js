let loginData = {}

function resetLoginData() {
    loginData = {}
    localStorage.removeItem("loginData");
    headerLogin.textContent = "";
    logoutButton.style.display = "none";
}

if (localStorage.hasOwnProperty("loginData")) {
    loginData = JSON.parse(localStorage.getItem("loginData"));
    headerLogin.textContent = "Logged in: " + loginData.name;
    welcomeText.textContent = loginData.name;
    logoutButton.style.display = "inline";
}

function handleResponse(res) {
    res = JSON.parse(res);
    if (res.error) {
        textDisplay.textContent = "Error: " + res.error;
        return;
    }
    switch (res.source) {
        case "create-account":
            textDisplay.textContent = "Registered successfully, " + res.name
            break;
        case "login":
            textDisplay.textContent = "Logging on...";
            loginData.id = res.token;
            post("transactions", "token");
            post("check-token", "token");
            break;
        case "check-token":
            let keepId = loginData.id;
            loginData = Object.assign(loginData, res); //If we don't keep the original id, this replaces it with a wrong one
            loginData.id = keepId;
            textDisplay.textContent = "Logged in successfully, " + res.name;
            localStorage.setItem("loginData", JSON.stringify(loginData));
            window.setTimeout(function(){window.location = "account.html"},300);
            break;
        case "logout":
            textDisplay.textContent = "Logged out successfully, " + loginData.name;
            resetLoginData();
            window.location = "index.html";
            break;
        case "transactions":
            loginData.transactions = res.data;
            localStorage.setItem("loginData", JSON.stringify(loginData));
            populateTable()
            break;

        case "transactions/post":
            post("transactions", "token")
            break;
    }

}

function post(action, type) {
    let sendData = {}

    switch (type){
        case "userpass":
            sendData = {
                name: nameInput.value,
                user: userInput.value,
                pass: passInput.value
            }
            break;

        case "token":
            sendData.token = loginData.id;
            break;
        case "payment":
            sendData = {
                from: loginData.accounts['0'].number,
                to: formTo.value,
                amount: Number(formAmount.value),
                exp: formExp.value,
                token: loginData.id
            }
    }

    const request = new Request('http://localhost:3001/bankAPI/' + action, {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify(sendData)
    });
    fetch(request).then(response => response.text()).then(data => handleResponse(data));
}