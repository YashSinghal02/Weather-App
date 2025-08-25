let key = "abd5a3df6c5a4e9599f123553252108";

    async function Search() {
      try {
        let city = document.querySelector("input").value;

        if (city.trim() === '') {
          alert("Enter The City");
          return;
        }

        let res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=yes`);

        if (res.status == 400) {
          document.querySelector(".error").style.display = "block";
          document.querySelector(".inner-container").style.display = "none";
        } else {
          let data = await res.json();
          console.log(data)

          document.querySelector(".cityname").innerHTML = `City : ${data.location.name}`;
          document.querySelector(".country").innerHTML = `Country : ${data.location.country}`;
          document.querySelector(".temp").innerHTML = `${Math.floor(data.current.temp_c)}°C`;

          document.querySelector(".cloud-text").innerHTML = `${data.current.cloud}% Cloud`;
          document.querySelector(".humidity-text").innerHTML = `${data.current.humidity}% Humidity`;
          document.querySelector(".wind-text").innerHTML = `${data.current.wind_kph} kph Wind`;

          // Air Quality
          document.querySelector(".PM2").innerHTML = `PM2.5<br>${data.current.air_quality.pm2_5.toFixed(1)} µg/m³`;
          document.querySelector(".PM10").innerHTML = `PM10<br>${data.current.air_quality.pm10.toFixed(1)} µg/m³`;
          document.querySelector(".O3").innerHTML = `O₃<br>${data.current.air_quality.o3.toFixed(1)} µg/m³`;
          document.querySelector(".NO").innerHTML = `NO₂<br>${data.current.air_quality.no2.toFixed(1)} µg/m³`;
          document.querySelector(".SO2").innerHTML = `SO₂<br>${data.current.air_quality.so2.toFixed(1)} µg/m³`;
          document.querySelector(".co").innerHTML = `CO<br>${(data.current.air_quality.co/1000).toFixed(2)} mg/m³`;

          // Weather icon
          let weatherIcon = document.querySelector(".icon");
          let condition = data.current.condition.text;

          if (condition === "Clear") {
            weatherIcon.src = "clear.png";
          }
          else if (condition === "Clouds" || condition === "Cloudy" || condition === "Partly Cloudy" || condition === "Overcast") {
            weatherIcon.src = "clouds.png";
          } 
          else if (condition === "Drizzle") {
            weatherIcon.src = "drizzle.png";
          }
          else if (condition === "Mist") {
            weatherIcon.src = "mist.png";
          }
          else if (condition === "Rain" || condition === "Light rain" || condition === "Light rain shower")  {
            weatherIcon.src = "rain.png";
          }
          else if(condition === "Moderate or heavy rain shower" || condition === "Moderate or heavy rain with thunder")
          {
             weatherIcon.src = "thunder.png";
          }

          else if (condition === "Snow") {
            weatherIcon.src = "snow.png";
          }
          else if (condition === "Fog") {
            weatherIcon.src = "fog.png";
          }
          else if (condition === "Patchy rain nearby") {
            weatherIcon.src = "patchyrain.png";
          }
          else {
            weatherIcon.src = "default.png";
          }

          document.querySelector(".inner-container").style.display = "flex";
          document.querySelector(".error").style.display = "none";
          document.querySelector("input").value = '';
        }
      } catch (err) {
        console.log(err);
      }
    }