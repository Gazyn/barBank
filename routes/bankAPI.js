let express = require("express");
let router = express.Router();
const base = 'https://barbank.diarainfra.com';

function handleResponse(res, json, source) {
    if(json === "") {
        return res.send({'source': source});
    }
    json = JSON.parse(json);
    if(Array.isArray(json)) {
        json = {data: json, source: source}
    } else {
        json.source = source;
    }
    res.send(json);
}

function send(res, source, method, path, data, token) {
    const fetch = process.browser ? window.fetch : require('node-fetch').default;

    const opts = { method, headers: {}};

    if (data) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(data);
    }

    if (token) {
        opts.headers['Authorization'] = 'Bearer '+token;
    }
    fetch(base+"/"+path, opts)
        .then(r => r.text())
        .then(json => handleResponse(res, json, source))
}


router.post("/create-account", function(req, res) {
    send(res, 'create-account', 'POST', 'users', {
        "name": req.body.name,
        "username": req.body.user,
        "password": req.body.pass
    })
})

router.post("/login", function(req, res) {
    send(res, 'login', 'POST', 'sessions', {
        "username": req.body.user,
        "password": req.body.pass
    })
})

router.post("/check-token", function(req, res) {
    send(res, 'check-token', 'GET', 'users/current', undefined, req.body.token);
})

router.post("/logout", function(req, res) {
    send(res, 'logout', 'DELETE', 'sessions', undefined, req.body.token);
})

router.post("/transactions", function(req, res) {
    send(res, 'transactions', 'GET', 'transactions', undefined, req.body.token);
})

router.post("/transactions/post", function(req, res) {
    send(res, 'transactions/post', 'POST', 'transactions',{
        'accountFrom': req.body.from,
        'accountTo': req.body.to,
        'amount': req.body.amount,
        'explanation': req.body.exp
    }, req.body.token);
})

module.exports = router;