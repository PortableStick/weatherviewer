import $ from 'jquery';
import handlebars from 'handlebars';

$(document).ready(() => {
  const currentTemplate = handlebars.compile($('#current-template').html()),
   forecastTemplate = handlebars.compile($('#future-template').html());

  if ("geolocation" in navigator) {
    getPositionData().then((position) => {
      const coords = `${position.coords.latitude},${position.coords.longitude}`;
      return getWeatherData(coords);
    }).then((data) => {
        console.log(data);
        $('.current-location').html(data.city);
        $('.today').append(currentTemplate(data.currentWeather));

      data.nextWeekWeather.forEach((forecast) => {
        $('.five-day').append(forecastTemplate(forecast))
      })
    }).catch((error) => {
      // display error
    });
  } else {
    // show geolocation error
  }
});

function getWeatherData(coords) {
  return $.ajax({
    method: "POST",
    url: "http://localhost:9000/weather",
    data: JSON.stringify({
      "currentPosition": coords
    }),
    "dataType": "json",
    "contentType": "application/json"
  });
}

function getPositionData() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// need a function to change temperature units
