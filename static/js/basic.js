function setupParse() {

  Parse.initialize('XJFp6TdDwyF3T');
  Parse.serverURL = 'https://pincafe-parse.herokuapp.com/';

}

function generateStarHtml(rating) {

  var html = '';
  var r = Math.round(rating);

  var i;
  for(i=1 ; i <= r ; i++) {
    html += '<i class="fa fa-star"></i>';
  }
  for(i=r ; i<5 ; i++) {
    html += '<i class="fa fa-star-o"></i>';
  }

  return html;

}

function insertTagsAsync(cafe, domId) {

  var tagsRelation = cafe.relation('tags');
  var tagsQuery = tagsRelation.query();

  tagsQuery.find({
      success: function(results) {
        var tags = $(domId);
        var tagsHtml = '';
        for(var i = 0; i < results.length; i ++) {
          var t = results[i];
          tagsHtml += '<li><a href="#">#' + t.get('name') + '</a></li>';
        }
        tags.html(tagsHtml);
      },
      error: function(error) {
        console.log('Error: ' + error.code + ' ' + error.message);
      }
  });
}

