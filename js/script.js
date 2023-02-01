var lon;
var lat;
var now = luxon.DateTime.now();
var apiKey = "732b53dac3ec24d2df14a0698f84453c";
var j = 0;
var locationQueryURL;
var input;
var queryURL;
var recentSearches = [];
var cityName;
var currentTemperature;
var currentHumidity;
var currentWindSpeed;
var currentIconCode;
var cityElement;
var dateElement;
var currentTemperatureElement;
var currentHumidityElement;
var currentWindSpeedElement;
var currentIconElement;
var temperature;
var humidity;
var windSpeed;
var iconCode;
var day;
var forecastElements;
var temperatureElement;
var humidityElement;
var windSpeedElement;
var iconElement;

$("#search-button").on("click", function (e) {
  e.preventDefault();
  // Capture input and trim
  input = $("#search-input").val().trim();
  // Check if inputs in local storage
  var retrievedSearches = JSON.parse(localStorage.getItem("recentSearches"));
  if (!retrievedSearches) retrievedSearches = [];
  // Update recentSearches with inputs from localStorage
  recentSearches = retrievedSearches.concat([input]);
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  runSearch(input);
  $("#prev-searches").empty();
  previousButtons();
});

// Search API and handle
function runSearch(input) {
  $(".weather-displays").empty();
  // Use input to query api and return longitude and lattitude co-ordinates
  locationQueryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`;
  $.ajax({
    url: locationQueryURL,
    method: "GET",
  }).then(function (result) {
    lon = result[0].lon;
    lat = result[0].lat;
    // Use co-ordinates to return data on original inputs
    queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (result) {
      // Assign variables to each data for 'current' weather
      cityName = result.city.name;
      currentTemperature = result.list[0].main.temp - 272.15;
      currentHumidity = result.list[0].main.humidity;
      currentWindSpeed = result.list[0].wind.speed;
      currentIconCode = result.list[0].weather[0].icon;
      // Create element variables with api data in
      cityElement = $("<h2>");
      cityElement.text(cityName);
      date = now.toLocaleString();
      dateElement = $(`<h5>Today: ${date}</h5>`);
      currentTemperatureElement = $(`<p>${currentTemperature.toFixed(2)}C</p>`);
      currentHumidityElement = $(`<p>Humidity: ${currentHumidity}</p>`);
      currentWindSpeedElement = $(`<p>Wind Speed: ${currentWindSpeed}</p>`);
      currentIconElement = $(
        `<img src="https://openweathermap.org/img/w/${currentIconCode}.png" alt="weather icon" width="50">`
      );
      // Append the elements
      $("#today").append(
        cityElement,
        dateElement,
        currentTemperatureElement,
        currentHumidityElement,
        currentWindSpeedElement,
        currentIconElement
      );
      // Iterate through return to show next 4 days of weather, same process as above
      for (var j = 8; j < 41; j += 8) {
        temperature = result.list[j].main.temp - 272.15;
        humidity = result.list[j].main.humidity;
        windSpeed = result.list[j].wind.speed;
        iconCode = result.list[j].weather[0].icon;
        day = j / 8;
        temperatureElement = `<p>${temperature.toFixed(2)}C</p>`;
        humidityElement = `<p>Humidity: ${humidity}</p>`;
        windSpeedElement = `<p>Wind Speed: ${windSpeed}</p>`;
        iconElement = `<img src="https://openweathermap.org/img/w/${iconCode}.png" alt="weather icon" width="50">`;
        forecastElements = `<div class="forecast-div w-25 p-3">
        +${day} day
        ${temperatureElement}
        ${humidityElement}
        ${windSpeedElement}
        ${iconElement}</div>`;
        $("#forecast").append(forecastElements);
      }
    });
  });
}
previousButtons();

// Show previous searches
function previousButtons() {
  var recentSearches = JSON.parse(
    localStorage.getItem("recentSearches", input)
  );
  // Iterate through previous searches
  for (let i = 0; i < recentSearches.length; i++) {
    // Create and append previous buttons
    var prevListItem = $(
      `<i class="search-btn btn btn-block btn-outline btn-accent mb-2" data-name="${recentSearches[i]}">`
    );
    prevListItem.text(`${recentSearches[i]}`);
    $("#prev-searches").append(prevListItem);
  }
  // Use previous search buttons as input
  $(".search-btn").on("click", function (event) {
    event.preventDefault();
    runSearch($(this).attr("data-name"));
    console.log($(this).attr("data-name"));
  });
}

// Clear previous searches from screen and localStorage
$("#clear-searches-btn").on("click", function (event) {
  event.preventDefault();
  localStorage.removeItem("recentSearches"); // Only removes highscore local storage data to keep dark mode localstorage
  $("#prev-searches").empty();
});
