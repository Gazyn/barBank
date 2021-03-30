//Style stuff
let $headline = $('.headline'),
    $inner = $('.inner'),
    $nav = $('nav'),
    navHeight = 75;

$(window).scroll(function () {
    var scrollTop = $(this).scrollTop(),
        headlineHeight = $headline.outerHeight() - navHeight,
        navOffset = $nav.offset().top;

    $headline.css({
        'opacity': (1 - scrollTop / headlineHeight)
    });
    $inner.children().css({
        'transform': 'translateY(' + scrollTop * 0.4 + 'px)'
    });
    if (navOffset > headlineHeight) {
        $nav.addClass('scrolled');
    } else {
        $nav.removeClass('scrolled');
    }
});

function selectTab(e, name) {
    allClickables.forEach(function(e) {
        e.style['background-color'] = "white";
    })
    e.style['background-color'] = "#e0e0e0";
    switch(name) {
        case "register":
            registerButton.style.display = "inline";
            loginButton.style.display = "none";
            nameInput.style.display = "flex";
            break;
        case "login":
            registerButton.style.display = "none";
            loginButton.style.display = "inline";
            nameInput.style.display = "none";
    }
}

allClickables.forEach(
    function (e) {
        e.addEventListener("click", function () {
            const clicked = (e.id.match(/[^-]+/)[0]); //name of clickable (everything before the -)
            selectTab(e, clicked);
        })
    }
)