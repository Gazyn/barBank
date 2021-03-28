//Style stuff
let $headline = $('.headline'),
    $inner = $('.inner'),
    $nav = $('nav'),
    navHeight = 75;

$(window).scroll(function() {
    var scrollTop = $(this).scrollTop(),
        headlineHeight = $headline.outerHeight() - navHeight,
        navOffset = $nav.offset().top;

    $headline.css({
        'opacity': (1 - scrollTop / headlineHeight)
    });
    $inner.children().css({
        'transform': 'translateY('+ scrollTop * 0.4 +'px)'
    });
    if (navOffset > headlineHeight) {
        $nav.addClass('scrolled');
    } else {
        $nav.removeClass('scrolled');
    }
});


//Server stuff

const textDisplay = document.querySelector("#text-display")

function handleResponse(res) {
    res = JSON.parse(res);
    console.log(res);
    if (res.error) {
        textDisplay.textContent = "Error: "+res.error;
        return;
    }
    switch (res.source) {
        case "create-account":
            textDisplay.textContent = "Registered successfully, "+res.name
            break;
    }
}

function post(action, type) {
    if(action === "login" && loginData.isIn) {
        textDisplay.textContent = "You're already logged in!";
        return;
    }
    let sendData = {}
    if(type === "userpass") {
        sendData = {
            name: document.querySelector("#nameInput").value,
            user: document.querySelector("#userInput").value,
            pass: document.querySelector("#passInput").value
        }
    }
    if(type === "token") {
        sendData = {
            token: loginData.token
        }
    }
    const request = new Request('http://localhost:3001/bankAPI/'+action, {headers: {'Content-Type': 'application/json'},　method: 'POST', body: JSON.stringify(sendData)});
    fetch(request).then(response => response.text()).then(data => handleResponse(data));

}