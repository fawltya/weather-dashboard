var lon;
var lat;
var now = luxon.DateTime.now();
var apiKey = "732b53dac3ec24d2df14a0698f84453c";
var j = 0;
var locationQueryURL;
var input;
var queryURL;
var recentSearches = [];

$("#search-button").on("click", function (e) {
  e.preventDefault();
  input = $("#search-input").val().trim();
  var retrievedSearches = JSON.parse(localStorage.getItem("recentSearches"));
  if (!retrievedSearches) retrievedSearches = [];
  recentSearches = retrievedSearches.concat([input]);
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  //   recentSearches.push(input);
  //   localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  //   console.log(recentSearches);
  runSearch(input);
  $("#prev-searches").empty();
  previousButtons();

  //   $("#search-input").empty(); // not working
});

function runSearch(input) {
  /** Get search input query */
  //   $("#today").empty();
  $("#today").empty();
  $("#forecast").empty();
  locationQueryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`;

  // Clear prev
  //   $("#today").empty();
  //   $("#forecast").empty();
  // Search for city and convert to lon/lat
  $.ajax({
    url: locationQueryURL,
    method: "GET",
  }).then(function (result) {
    lon = result[0].lon;
    lat = result[0].lat;

    queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

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

      //   $("#forecast").empty(); // Clear previous data
      for (j = 8; j < 41; j += 8) {
        var Temperature = result.list[j].main.temp - 272.15;
        //   console.log(currentTemperature.toFixed(2));
        var Humidity = result.list[j].main.humidity;
        var WindSpeed = result.list[j].wind.speed;
        var IconCode = result.list[j].weather[0].icon;
        var day = j / 8;

        TemperatureElement = `<p>${Temperature.toFixed(2)}C</p>`;
        HumidityElement = `<p>Humidity: ${Humidity}</p>`;
        WindSpeedElement = `<p>Wind Speed: ${WindSpeed}</p>`;
        IconElement = `<img src="https://openweathermap.org/img/w/${IconCode}.png" alt="weather icon" width="50">`;
        var forecastElements = `<div class="forecast-div w-25 p-3">
            +${day} day
            ${TemperatureElement}
            ${HumidityElement}
            ${WindSpeedElement}
            ${IconElement}`;
        // forecastElements.append(
        //   currentTemperatureElement,
        //   currentHumidityElement,
        //   currentWindSpeedElement,
        //   currentIconElement
        // );
        // $("#forecast").empty();
        $("#forecast").append(forecastElements);
      }
    });
  });
}
previousButtons();
// $(document).ready(function () {

// });
function previousButtons() {
  //   $("#history").empty();
  var recentSearches = JSON.parse(
    localStorage.getItem("recentSearches", input)
  );

  for (let i = 0; i < recentSearches.length; i++) {
    var prevListItem = $(
      `<i class="search-btn" data-name="${recentSearches[i]}">`
    );
    prevListItem.text(`${recentSearches[i]}`);

    $("#prev-searches").append(prevListItem);
  }
}
if ($(".search-btn")) {
  $("#clear-searches-btn").on("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("recentSearches"); // Only removes highscore local storage data to keep dark mode localstorage
    $("#prev-searches").empty();
  });
}

// $(".search-btn").on("click", function (e) {
//   e.preventDefault();
//   runSearch($("data-name"));
// });

// $(document).on("click", ".search-btn", runSearch($("data-name")));
// $(document).on("click", ".search-btn", runSearch($("data-name")));
