var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/s/:keyword', function(req, res) {
    res.render('pages/search', {keyword: req.params.keyword});
});

app.get('/p/:cafeId', function(req, res) {
    res.render('pages/profile', {cafeId: req.params.cafeId});
});

var port = process.env.PORT || 8000;
app.listen(port, function(){
    console.log('pincafe is running on port ' + port);
});
