var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"))

var server = app.listen(8081, function() {
    console.log("App is started at http://%s:%s", server.address().address, server.address().port)
})