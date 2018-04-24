var express = require('express');
var app = express();

// https://www.askforgametask.com/html5/tutorials/flappy/
// http://caza.la/synaptic/#/

app.use(express.static(__dirname + "/public"))

app.get('/api', function(req, res) {
    res.send('Hello World');
})

var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})