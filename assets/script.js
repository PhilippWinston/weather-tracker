$(function () {
  var cities = JSON.parse(localStorage.getItem("cities")) || []; // array to store weather data for each city
  var forecastdata = JSON.parse(localStorage.getItem("forecast-data")) || [];
  $(".search-btn").on("click", function () {
    var city = $(".city").val().trim();
    if (city === "") {
      return; // do nothing if the search bar is empty
    }
    getCurrentWeather(city);
    getForecast(city);
  });

  // populate past searches list on modal open
  $("[data-modal-target]").on("click", function () {
    var list = $(".past-searches-list");
    list.empty();
    for (var i = 0; i < cities.length; i++) {
      var item = $("<a>")
        .attr("href", "#")
        .addClass("block py-2")
        .text(cities[i].city);
      list.append(item);
    }
  });

  const pastSearches = document.querySelector(".past-searches-list");
  pastSearches.addEventListener("click", (event) => {
    const clickedLink = event.target.closest("a");
    if (clickedLink) {
      const city = clickedLink.textContent;
      getCurrentWeather(city);
      getForecast(city);
    }
  });

  var today = dayjs();
  console.log(today);
  $("#currentDay").text(today.format("MMMM D, YYYY"));

  function updateFutureDate(daysToAdd, className) {
    var future = dayjs().add(daysToAdd, "day");
    console.log(future);
    $(className).find(".date").text(future.format("MMMM D, YYYY"));
  }
  updateFutureDate(1, "#day1");
  updateFutureDate(2, "#day2");
  updateFutureDate(3, "#day3");
  updateFutureDate(4, "#day4");
  updateFutureDate(5, "#day5");
  function getCurrentWeather(city) {
    var country = "US";
    var weatherAPIKey = "48ac0fdf347a53092e08e9c42532b5e3";
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "," +
      country +
      "&appid=" +
      weatherAPIKey +
      "&units=imperial";
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // check if city already exists in the array
        var cityExists = cities.some(function (item) {
          return item.city.toLowerCase() === city.toLowerCase();
        });
        if (!cityExists) {
          // save weather data for this city to local storage
          cities.push({
            city: city,
            temp: data.main.temp,
            weather: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
          });
          localStorage.setItem("cities", JSON.stringify(cities));
        }
        console.log(data);

        // display weather data for today

        $("#currentDay").text;
        $(".cityName").text(city);
        $(".temperature").text(data.main.temp);
        $(".weatherDescription").text(data.weather[0].description);
        $(".humidity").text(data.main.humidity);
        $(".weatherIcon").attr(
          "src",
          "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
        );

        // update past searches list
        var list = $(".past-searches-list");
        list.empty();
        for (var i = 0; i < cities.length; i++) {
          var item = $("<a>")
            .attr("href", "#")
            .addClass("block py-2")
            .text(cities[i].city);
          list.append(item);
        }
      });
  }
  function getForecast(city) {
    // forecast api pull

    var forecastAPIKey = "3fa98c70c5ea5429d6f6c8aad68efa68";
    var country = "US";

    const forecastQueryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "," +
      country +
      "&appid=" +
      forecastAPIKey +
      "&units=imperial" +
      "&cnt=6";

    fetch(forecastQueryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // check if forecast already exists in the array
        var forcastDataExists = forecastdata.some(function (item) {
          return item.city.toLowerCase() === city.toLowerCase();
        });
        if (!forcastDataExists) {
          // save weather data for this city to local storage
        }
        console.log(data);
        // Get the weather data for each day
        var weatherData = data.list.slice(1);

        // Update the HTML elements with the weather data for each day
        weatherData.forEach(function (day, index) {
          // Get the HTML element for the corresponding day
          var dayElement = $("#day" + (index + 1));

          // Update the HTML element with the weather data for the day
          var temperature = day.main.temp;
          var description = day.weather[0].description;
          var icon = day.weather[0].icon;
          dayElement.find(".temperature").text(temperature + "°F");
          dayElement.find(".description").text(description);
          dayElement.find(".humidity").text(description);
          dayElement
            .find(".icon")
            .attr("src", "https://openweathermap.org/img/w/" + icon + ".png");

          forecastdata.push({
            city: city,
            temp: day.main.temp,
            weather: day.weather[0].main,
            description: day.weather[0].description,
            icon: day.weather[0].icon,
            humidity: day.main.humidity,
          });
        });
        localStorage.setItem("forecast-date", JSON.stringify(forecastdata));
      });
  }
});
