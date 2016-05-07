var keyword = '';

function fillInKeywordInSearchBox() {
  $('#search-box').val(keyword);
}

function initMap() {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {

      center: {lat: 25.0226503, lng: 121.5310498},
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

  var fakeMarker1 ={lat: 25.0226503, lng: 121.5310498};
  var fakeMarker2 ={lat: 25.0246603, lng: 121.5310498};
  var fakeMarker3 ={lat: 25.0216703, lng: 121.5300498};
  var fakeMarker4 ={lat: 25.0246803, lng: 121.5300498};
  var fakeMarker5 ={lat: 25.0236903, lng: 121.5310498};

  var marker1 = new google.maps.Marker({
      position: fakeMarker1,
      map: map
  });
  var marker2 = new google.maps.Marker({
      position: fakeMarker2,
      map: map
  });
  var marker3 = new google.maps.Marker({
      position: fakeMarker3,
      map: map
  });
  var marker4 = new google.maps.Marker({
      position: fakeMarker4,
      map: map
  });
  var marker5 = new google.maps.Marker({
      position: fakeMarker5,
      map: map
  });

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
    updateData();
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
      updateData();
    } else if(val == 'specific') {
      filterOption.openOn = TimeOption.SPECIFIC;
    } else if(val == 'any') {
      filterOption.openOn = TimeOption.ANY;
      updateData();
    }
  });

}

function setupOpenOnSepcificTimeListener() {
  $('#specific-time-confirm').click(function() {
    saveSelectedSpecificTimeAsFilterOption();
    showSelectedSpecificTimeOnPage();
    updateData();
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

    updateData();

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
    updateData();
  });
}

function updateData() {
  console.log('updating data...');
  console.log(filterOption.foodTypes);
}

$(document).ready(function() {

  setupListeners();
  updateData();

  fillInKeywordInSearchBox();
  setSpecificTimeModalToNowInDefault();

});
