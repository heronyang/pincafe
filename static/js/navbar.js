$('#search-box').focus();
$('.navbar form').submit(function(event) {
  event.preventDefault();
  var keyword = $('#search-box').val();
  window.location.href = window.location.origin + '/s/' + keyword;
});
