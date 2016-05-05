var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/s', function(req, res) {
    res.render('pages/search');
});

app.get('/p', function(req, res) {
    res.render('pages/profile');
});

var port = process.env.PORT || 8000;
app.listen(port, function(){
    console.log('pincafe is running on port ' + port);
});
