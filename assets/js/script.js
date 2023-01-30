var lon;
var lat;
var now = luxon.DateTime.now();
console.log(now);
var apiKey = "732b53dac3ec24d2df14a0698f84453c";
var j = 0;

var recentSearches = [];

$("#search-button").on("click", function (e) {
  e.preventDefault();
  input = $("#search-input").val().trim();
  recentSearches.push(input);
  runSearch(input);
});

function runSearch(input) {
  /** Get search input query */

  var locationQueryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`;

  // Clear prev
  $("#today").empty();
  $("#search-input").empty(); // not working
  // Search for city and convert to lon/lat
  $.ajax({
    url: locationQueryURL,
    method: "GET",
  }).then(function (result) {
    lon = result[0].lon;
    lat = result[0].lat;

    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (result) {
      var cityName = result.city.name;
      //   while (j < 40) {
      var currentTemperature = result.list[j].main.temp - 272.15;
      //   console.log(currentTemperature.toFixed(2));
      var currentHumidity = result.list[j].main.humidity;
      var currentWindSpeed = result.list[j].wind.speed;
      var currentIconCode = result.list[j].weather[0].icon;

      cityElement = $("<h2>").text(cityName);
      date = now.toLocaleString();
      dateElement = `<h5>Today: ${date}</h5>`;
      currentTemperatureElement = `<p>${currentTemperature.toFixed(2)}C</p>`;
      currentHumidityElement = `<p>Humidity: ${currentHumidity}</p>`;
      currentWindSpeedElement = `<p>Wind Speed: ${currentWindSpeed}</p>`;
      currentIconElement = `<img src="https://openweathermap.org/img/w/${currentIconCode}.png" alt="weather icon" width="50">`;

      $("#today").append(
        cityElement,
        dateElement,
        currentTemperatureElement,
        currentHumidityElement,
        currentWindSpeedElement,
        currentIconElement
      );

      for (j = 8; j < 41; j += 8) {
        var currentTemperature = result.list[j].main.temp - 272.15;
        //   console.log(currentTemperature.toFixed(2));
        var currentHumidity = result.list[j].main.humidity;
        var currentWindSpeed = result.list[j].wind.speed;
        var currentIconCode = result.list[j].weather[0].icon;

        currentTemperatureElement = `<p>${currentTemperature.toFixed(2)}C</p>`;
        currentHumidityElement = `<p>Humidity: ${currentHumidity}</p>`;
        currentWindSpeedElement = `<p>Wind Speed: ${currentWindSpeed}</p>`;
        currentIconElement = `<img src="https://openweathermap.org/img/w/${currentIconCode}.png" alt="weather icon" width="50">`;
        var forecastElements = `<div class="forecast-div w-25 p-3">${currentTemperatureElement}
            ${currentHumidityElement}
            ${currentWindSpeedElement}
            ${currentIconElement}`;
        // forecastElements.append(
        //   currentTemperatureElement,
        //   currentHumidityElement,
        //   currentWindSpeedElement,
        //   currentIconElement
        // );
        $("#forecast").append(forecastElements);
      }
    });
  });
}

function previousButtons() {
  //   previousButton.empty();
  for (let i = 0; i < recentSearches.length; i++) {
    // var previousButton = `<button class="search-btn" data-name="${recentSearches[i]}>${recentSearches[i]}</button>`;
    // console.log(previousButton);
    // previousButton.appendTo($("#history"));
    $("#history").append(
      `<button class="search-btn" data-name="${recentSearches[i]}>${recentSearches[i]}</button>`
    );

    // $("#history").setHTML(previousButton);
  }
}

// previousButtons();
// $(document).on("click", ".search-btn", runSearch($("data-name")));
