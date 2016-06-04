var keyword = '';

function fillInKeywordInSearchBox() {
  $('#search-box').val(keyword);
}

var cafePositions = [];
var cafeMakers = [];

var cafeList = [];

function setupMap() {
  $.getScript("https://maps.googleapis.com/maps/api/js?callback=initMap&key=AIzaSyDiw_0Dnug9zP27jioy8ezTik5aF2Kw83o");
}

function initMap() {

  var geocoder =  new google.maps.Geocoder();
  geocoder.geocode( {'address': keyword + ' 台北'}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      buildMap(lat, lng);
      updateCafeOnMap();
    } else {
      console.log("fail: " + status);
    }
  });

}

function buildMap(lat, lng) {

  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {

      center: {lat: lat, lng: lng},
      zoom: 17,

      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      }

  });

}

function updateCafeOnMap() {

  for(var i in cafePositions) {

    var position = cafePositions[i];

    var marker = new google.maps.Marker({
        position: position,
        map: map
    });

    cafeMakers.push(marker);

  }

}

function setKeyword(k) {
  keyword = k;
}

var TimeOption = Object.freeze({
    NOW: 0,
    SPECIFIC: 1,
    ANY: 2
});

var FoodType = Object.freeze({
    BRUNCH: 0,
    MEAL: 1,
    LIGHT_FOOD: 2,
    SNACK: 3
});

var SortingMethod = Object.freeze({
    RATING: 0,
    DISTANCE: 1
});

var WeekDay = Object.freeze({
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
    THRUSDAY: 3,
    FRIDAY: 4,
    SATURDAY: 5,
    SUNDAY: 6
});

var filterOption = {

  hasWifi: false,
  hasPower: false,
  hasTimeLimitation: false,
  isReservationAvailable: false,
  openOn: TimeOption.NOW,
  foodTypes: new Set([]),
  specificTimeWeekday: WeekDay.MONDAY,
  specificTimeStartHours: 0,
  specificTimeEndHours: 0,
  sortingMethod: SortingMethod.RATING

};

function setupListeners() {
  setupOptionBoxListeners();
  setupUtilityListeners();
  setupOpenOnListeners();
  setupFoodTypeListeners();
  setupSortingMethodListener();
}

function setupOptionBoxListeners() {
  $('.option-box').click(function () {
    $(this).toggleClass('enabled');
  });
}

function setupUtilityListeners() {
  $('.option-box-utility').click(function(event) {
    var enabled = $(this).hasClass('enabled');
    var val = $(this).data('val');
    if(val == 'has-wifi') {
      filterOption.hasWifi = enabled;
    } else if (val == 'has-power') {
      filterOption.hasPower = enabled;
    } else if (val == 'has-time-limitation') {
      filterOption.hasTimeLimitation = enabled;
    } else if (val == 'is-reservation-available') {
      filterOption.isReservationAvailable = enabled;
    }
    applyFilterOnResults();
  });
}

function setupOpenOnListeners() {

  setupOpenOnSepcificTimeListener();

  $('.option-box.option-box-time').click(function () {
    $('.option-box.option-box-time').removeClass('enabled');
    $(this).addClass('enabled');
    var val = $(this).data('val');
    if(val == 'now') {
      filterOption.openOn = TimeOption.NOW;
      applyFilterOnResults();
    } else if(val == 'specific') {
      filterOption.openOn = TimeOption.SPECIFIC;
    } else if(val == 'any') {
      filterOption.openOn = TimeOption.ANY;
      applyFilterOnResults();
    }
  });

}

function setupOpenOnSepcificTimeListener() {
  $('#specific-time-confirm').click(function() {
    saveSelectedSpecificTimeAsFilterOption();
    showSelectedSpecificTimeOnPage();
    applyFilterOnResults();
  });
}

function saveSelectedSpecificTimeAsFilterOption() {

  var weekday = $('#specific-time-weekday').val();
  var startHours = $('#specific-time-start-hour').val();
  var endHours = $('#specific-time-end-hour').val();

  filterOption.specificTimeWeekday = parseInt(weekday);
  filterOption.specificTimeStartHours = parseInt(startHours);
  filterOption.specificTimeEndHours = parseInt(endHours);

}

function showSelectedSpecificTimeOnPage() {

  var weekdayText = $('#specific-time-weekday option:selected').text();
  var startHoursText = $('#specific-time-start-hour option:selected').text();
  var endHoursText = $('#specific-time-end-hour option:selected').text();
  $('#specific-time-text').text(weekdayText + ' ' + startHoursText + ' ~ ' + endHoursText);

}

function setSpecificTimeModalToNowInDefault() {

  var now = new Date();
  var weekday = now.getDay();
  var startHours = now.getHours();
  var endHours = (startHours < 23)? (startHours + 1) : (startHours - 23);

  $('#specific-time-weekday').val(weekday);
  $('#specific-time-start-hour').val(startHours);
  $('#specific-time-end-hour').val(endHours);

  filterOption.specificTimeWeekday = weekday;
  filterOption.specificTimeStartHours = startHours;
  filterOption.specificTimeEndHours = endHours;

}

function setupFoodTypeListeners() {
  $('.option-box-foodtype').click(function(event) {

    var enabled = $(this).hasClass('enabled');
    var val = $(this).data('val');
    var foodTypes = null;

    if(val == 'brunch') {
      foodTypes = FoodType.BRUNCH;
    } else if (val == 'meal') {
      foodTypes = FoodType.MEAL;
    } else if (val == 'light-food') {
      foodTypes = FoodType.LIGHT_FOOD;
    } else if (val == 'snack') {
      foodTypes = FoodType.SNACK;
    }

    if(enabled){
      filterOption.foodTypes.add(foodTypes);
    } else {
      filterOption.foodTypes.delete(foodTypes);
    }

    applyFilterOnResults();

  });
}

function setupSortingMethodListener() {
  $('#pincafe-sorting-method').change(function() {
    var val = $('#pincafe-sorting-method').val();
    if(val == 'rating') {
      filterOption.sortingMethod = SortingMethod.RATING;
    } else if(val == 'distance') {
      filterOption.SortingMethod = SortingMethod.DISTANCE;
    }
    applyFilterOnResults();
  });
}

function loadInitData() {
  // TODO: apply filter options

  showResultIsLoading();

  var Cafe = Parse.Object.extend('Cafe');
  var query = new Parse.Query(Cafe);
  query.descending('createdAt');
  query.find({
      success: function(cafes) {

        clearResultLayout();

        for(var i = 0; i < cafes.length; i ++) {
          var cafe = cafes[i];
          cafeList.push({"cafe": cafe, "show": true});
        }

        showCafeListOnLayout();

      },
      error: function(object, error) {
        console.log('fail');
      }
  });
}

function applyFilterOnResults() {
  // TODO
  clearResultLayout();
  showCafeListOnLayout();
}

function showResultIsLoading() {
  var result = $('#pincafe-result');
  result.html('載入中...');
}

function clearResultLayout() {
  var result = $('#pincafe-result');
  result.html('');
}

function showCafeListOnLayout() {
  for(var i in cafeList) {
    var cafe = cafeList[i].cafe;
    addCafeToResult(cafe);
  }
}

function addCafeToResult(cafe) {

  var name = cafe.get('name');
  var id = cafe.id;
  var ratingAverage = cafe.get('ratingAverage');
  var ratingCount = cafe.get('ratingCount');
  var ratingHtml = generateStarHtml(ratingAverage);

  var url = getCafeUrl(cafe);

  var result = $('#pincafe-result');
  var resultHtml = `
                <div class="col-md-6">

                  <div class="thumbnail">
                    <img id="pincafe-image-` + id +`" class="thumbnail-image" src="/img/blank.png" alt=""/>
                    <div class="caption">
                      <div class="container-fluid">
                        <div class="row">
                          <div class="col-md-6">
                            <h3><a href="` + url +`">` + name + `</a></h3>
                            <h4>
                            ` + ratingHtml + `
                              <span class="rating-count">(` + ratingCount +`)</span>
                            </h4>
                          </div>
                          <div class="col-md-6 right-col">
                            <span id="pincafe-wifi-` + id + `"></span>
                            <span id="pincafe-power-` + id + `"></span>
                            <span id="pincafe-time-` + id + `"></span>
                            <span id="pincafe-quite-` + id + `"></span>
                            <span id="pincafe-reservation-` + id + `"></span>
                            <br />
                            <div class="row">
                              <div class="tag-container">
                                <ul class="pager">
                                <span id="pincafe-tags-` + id + `"></span>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
  `;
  result.append(resultHtml);

  insertOnMap(cafe);
  insertThumbnailImageAsync(cafe, '#pincafe-image-' + id);
  insertTagsAsync(cafe, '#pincafe-tags-' + id);
  insertUtilityAsync(cafe,
    '#pincafe-wifi-' + id,
    '#pincafe-power-' + id,
    '#pincafe-time-' + id,
    '#pincafe-quite-' + id,
    '#pincafe-reservation-' + id
  );

}

function insertOnMap(cafe) {

  var lat = parseFloat(cafe.get('latitude'));
  var lng = parseFloat(cafe.get('longitude'));

  var position = {lat: lat, lng: lng};
  console.log(position);
  cafePositions.push(position);

}

$(document).ready(function() {

  setupParse();

  setupListeners();
  loadInitData();

  fillInKeywordInSearchBox();
  setSpecificTimeModalToNowInDefault();

  setupMap();

});
