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
            console.log(loginData);
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
            console.log(loginData);
            localStorage.setItem("loginData", JSON.stringify(loginData));
            break;
    }
}

function post(action, type) {
    if (action === "login" && loginData.isIn) {
        textDisplay.textContent = "You're already logged in!";
        return;
    }
    let sendData = {}
    if (type === "userpass") {
        sendData = {
            name: nameInput.value,
            user: userInput.value,
            pass: passInput.value
        }
    }
    if (type === "token") {
        sendData.token = loginData.id;
    }
    const request = new Request('http://localhost:3001/bankAPI/' + action, {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify(sendData)
    });
    fetch(request).then(response => response.text()).then(data => handleResponse(data));
}