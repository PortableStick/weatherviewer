import $ from 'jquery';
import handlebars from 'handlebars';
import Rx, { Observable } from 'rxjs';
import { DOM } from 'rx-dom';

const currentTemplate = handlebars.compile($('#current-template').html()),
   forecastTemplate = handlebars.compile($('#future-template').html()),
   errorTemplate = handlebars.compile($('#error-template').html());

DOM.ready()
.flatMap(() => DOM.geolocation.getCurrentPosition({enableHighAccuracy: true}))
.flatMap(data => DOM.ajax({
  url: "http://localhost:9000/weather",
  method: "POST",
  body: JSON.stringify({"currentPosition": `${data.coords.latitude},${data.coords.longitude}`}),
  responseType: 'json',
  headers: {
    'content-type': 'application/json'
  }
}))
.map(data => data.response)
.subscribe(data => {
  $('.current-location').html(data.city);
  $('.today').append(currentTemplate(data.currentWeather));

  data.nextWeekWeather.forEach((forecast) => {
    $('.five-day').append(forecastTemplate(forecast))
  });
}, (error) => {
  // display error
  $('.jumbotron').html(errorTemplate(error));
  $('#scale-btn').hide();
});

Observable.fromEvent($('#scale-btn'), 'click').subscribe(() => {
  $('.temp').each((index, $item) => {
      $item = $($item);
      if($item.hasClass('farenheit')) {
          $item.removeClass('farenheit');
          $item.addClass('celsius');
          const temp = $item.html();
          $item.html(((temp - 32)/1.8).toFixed(2));
      } else if($item.hasClass('celsius')) {
          $item.removeClass('celsius');
          $item.addClass('farenheit');
          const temp = $item.html();
          $item.html(((temp * (1.8)) + 32).toFixed(2));
      }
  });
})
