var lon;
var lat;
// var DateTime = luxon.DateTime;
var now = luxon.DateTime.now();
console.log(now);
var apiKey = "732b53dac3ec24d2df14a0698f84453c";
$("#search-button").on("click", function (e) {
  e.preventDefault();

  /** Get search input query */
  var inputQuery = $("#search-input").val().trim();
  var locationQueryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${inputQuery}&limit=5&appid=${apiKey}`;

  // Clear prev
  $("#today").empty();
  // Search for city and convert to lon/lat
  $.ajax({
    url: locationQueryURL,
    method: "GET",
  }).then(function (result) {
    lon = result[0].lon;
    lat = result[0].lat;

    var queryURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (result) {
      console.log(result);
      var cityName = result.city.name;

      var currentTemperature = result.list[0].main.temp - 272.15;
      //   console.log(currentTemperature.toFixed(2));
      var currentHumidity = result.list[0].main.humidity;
      var currentWindSpeed = result.list[0].wind.speed;
      var currentIconCode = result.list[0].weather[0].icon;

      cityElement = $("<h2>").text(cityName);
      date = now.toLocaleString();
      dateElement = `<h5>Today - ${date}</h5>`;
      currentTemperatureElement = `<p>${currentTemperature.toFixed(2)}C</p>`;
      currentHumidityElement = `<p>Humidity: ${currentHumidity}</p>`;
      currentWindSpeedElement = `<p>Wind Speed: ${currentWindSpeed}</p>`;
      currentIconElement = `<img src="http://openweathermap.org/img/w/${currentIconCode}.png" alt="weather icon" width="50">`;

      $("#today").append(
        cityElement,
        dateElement,
        currentTemperatureElement,
        currentHumidityElement,
        currentWindSpeedElement,
        currentIconElement
      );
    });
  });
});
