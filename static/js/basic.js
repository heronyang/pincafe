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
        var tagsElement = $(domId);
        var tagsHtml = '';
        for(var i = 0; i < results.length; i ++) {
          var t = results[i];
          tagsHtml += '<span class="tag">#' + t.get('name') + '</span>';
        }
        tagsElement.html(tagsHtml);
      },
      error: function(error) {
        console.log('Error: ' + error.code + ' ' + error.message);
      }
  });

}

function insertThumbnailImageAsync(cafe, domId) {

  var thumbnailImage = cafe.get('thumbnailImage');

  if(!thumbnailImage) {
      return;
  }

  var thumbnailImageId = thumbnailImage.id;

  var ThumbnailImage = Parse.Object.extend('ThumbnailImage');
  var query = new Parse.Query(ThumbnailImage);

  query.get(thumbnailImageId, {
      success: function(thumbnailImage) {
        var url = thumbnailImage.get('url');
        var thumbnailImageElement = $(domId);
        thumbnailImageElement.attr('src', url);
      },
      error: function(error) {
      }
  });

}

function insertUtilityAsync(cafe, domIdWifi, domIdPower, domIdTime, domIdQuite, domIdReservation) {

  var hasFreeWifi = cafe.get('hasFreeWifi');
  var hasPowerOutlet = cafe.get('hasPowerOutlet');
  var hasTimeLimitation = cafe.get('hasTimeLimitation');
  var isQuiet = cafe.get('isQuiet');
  var isReservationAvailable = cafe.get('isReservationAvailable');

  console.log(hasFreeWifi, hasPowerOutlet, hasTimeLimitation, isQuiet, isReservationAvailable);
  console.log(domIdWifi, domIdPower);
  var a = $(domIdWifi);
  console.log(a);

  $(domIdWifi).html('<img class="icon-image" src="/img/item_wifi' + ((hasFreeWifi) ? '' : '-x') + '.png"/>');
  $(domIdPower).html('<img class="icon-image" src="/img/item_power' + ((hasPowerOutlet) ? '' : '-x') + '.png"/>');
  $(domIdTime).html('<img class="icon-image" src="/img/item_time' + ((hasTimeLimitation) ? '' : '-x') + '.png"/>');
  $(domIdQuite).html('<img class="icon-image" src="/img/item_quite' + ((isQuiet) ? '' : '-x') + '.png"/>');
  $(domIdReservation).html('<img class="icon-image" src="/img/item_booking' + ((isReservationAvailable) ? '' : '-x') + '.png"/>');

}

function insertBlogPostsAsync(cafe, domId) {

  var blogPostsRelation = cafe.relation('blogPosts');
  var query = blogPostsRelation.query();

  query.descending('createdAt');
  query.exists('title');
  query.exists('description');
  query.exists('author');
  query.exists('url');
  query.limit(5);

  query.find({
      success: function(results) {
        var blogPostsElement = $(domId);
        var blogPostsHtml = '';
        for(var i = 0; i < results.length; i ++) {
          var t = results[i];

          var title = t.get('title');
          var description = t.get('description');
          var url = t.get('url');
          var author = t.get('author');

          blogPostsHtml += '<div class="post"> <blockquote> <h4><a href="' + url + '">' + title + '</a></h4> <p><b class="author">' + author + '</b>' + description + '</p> </blockquote> </div>';
        }
        blogPostsElement.html(blogPostsHtml);
      },
      error: function(error) {
        console.log('Error: ' + error.code + ' ' + error.message);
      }
  });

}


function getCafeUrl(cafe) {
  var cafeId = cafe.get('cafeId');
  return window.location.origin + '/p/' + cafeId;
}

