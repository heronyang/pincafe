var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  // res.render('pages/index');
  res.redirect('/s/%E5%85%AC%E9%A4%A8%20%E5%B8%AB%E5%A4%A7');
});

app.get('/s/:keyword', function(req, res) {
  res.render('pages/search', {keyword: req.params.keyword});
});

app.get('/p/:cafeId', function(req, res) {
  var url = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.render('pages/profile', {cafeId: req.params.cafeId, url: url});
});

app.get('*', function(req, res){
    res.status(404).send('page not found');
});

var port = process.env.PORT || 8000;
app.listen(port, function(){
  console.log('pincafe is running on port ' + port);
});
