let key = "abd5a3df6c5a4e9599f123553252108";

    async function Search() {
      try {
        let city = document.querySelector("input").value;

        if (city.trim() === '') {
          alert("Enter some City.");
          return;
        }

        let res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=yes`);

        if (res.status == 400) {
          document.querySelector(".error").style.display = "block";
          document.querySelector(".inner-container").style.display = "none";
        } else {
          let data = await res.json();
          console.log(data)

          document.querySelector(".cityname").innerHTML = `<i class="fa-solid fa-location-dot pinicon"></i> : ${data.location.name}`;
          document.querySelector(".countryname").innerHTML = `<i class="fa-solid fa-earth-americas countryicon"></i> : ${data.location.country}`;
          document.querySelector(".temp").innerHTML = `${Math.floor(data.current.temp_c)}°C`;

          document.querySelector(".cloud-text").innerHTML = `${data.current.cloud}% Cloud`;
          document.querySelector(".humidity-text").innerHTML = `${data.current.humidity}% Humidity`;
          document.querySelector(".wind-text").innerHTML = `${data.current.wind_kph} kph Wind`;

          // Air Quality
          // document.querySelector(".PM2").innerHTML = `PM2.5<br>${data.current.air_quality.pm2_5.toFixed(1)} µg/m³`;
          if(data.current.air_quality.pm2_5 <= 30){
          document.querySelector(".PM2").innerHTML = `PM2.5<br>${data.current.air_quality.pm2_5.toFixed(1)} µg/m³<br><span style="color:green">Good</span>`;
          }
          else{
          document.querySelector(".PM2").innerHTML = `PM2.5<br>${data.current.air_quality.pm2_5.toFixed(1)} µg/m³<br><span 
          style="color:red">Bad</span>`; 
          }


          // PM10
          if (data.current.air_quality.pm10 <= 50) {
            document.querySelector(".PM10").innerHTML =`PM10<br>${data.current.air_quality.pm10.toFixed(1)} µg/m³ <br><span style="color:green">Good</span>`;
          } else {
            document.querySelector(".PM10").innerHTML = `PM10<br>${data.current.air_quality.pm10.toFixed(1)} µg/m³ <br><span style="color:red">Bad</span>`;
          }
          
          // O₃ (8hr avg)
          if (data.current.air_quality.o3 <= 50) {
            document.querySelector(".O3").innerHTML =`O₃<br>${data.current.air_quality.o3.toFixed(1)} µg/m³ <br><span style="color:green;">Good</span>`;
          } else {
            document.querySelector(".O3").innerHTML = `O₃<br>${data.current.air_quality.o3.toFixed(1)} µg/m³ <br><span style="color:red;">Bad</span>`;
          }
          
          // NO₂
          if (data.current.air_quality.no2 <= 40) {
            document.querySelector(".NO").innerHTML =`NO₂<br>${data.current.air_quality.no2.toFixed(1)} µg/m³  <br><span style="color:green;">Good</span>`;
          } else {
            document.querySelector(".NO").innerHTML =`NO₂<br>${data.current.air_quality.no2.toFixed(1)} µg/m³  <br><span style="color:red;">Bad</span>`;
          }
          
          // SO₂
          if (data.current.air_quality.so2 <= 40) {
            document.querySelector(".SO2").innerHTML = `SO₂<br>${data.current.air_quality.so2.toFixed(1)} µg/m³ <br><span style="color:green">Good</span>`;
          } else {
            document.querySelector(".SO2").innerHTML =`SO₂<br>${data.current.air_quality.so2.toFixed(1)} µg/m³ <br><span style="color:red;">Bad</span>`;
          }
          
          // CO
          if (data.current.air_quality.co <= 1.0) {
            document.querySelector(".co").innerHTML =`CO<br>${data.current.air_quality.co.toFixed(2)} mg/m³  <br><span style="color:green;">Good<span>`;
          } else {
            document.querySelector(".co").innerHTML =`CO<br>${data.current.air_quality.co.toFixed(2)} mg/m³ <br><span style="color:red;">Bad<span>`;
          }
          // Weather icon
          let weatherIcon = document.querySelector(".icon");
          let condition = data.current.condition.text.toLowerCase();

          if (condition.includes("clear") || condition.includes("sunny"))
          {
            weatherIcon.src = "clear.png";
          } 
          else if (condition.includes("cloud")) 
          {
            weatherIcon.src = "clouds.png";
          } 
          else if (condition.includes("drizzle")) 
            {
            weatherIcon.src = "drizzle.png";
          } 
          else if (condition.includes("mist")) 
          {
            weatherIcon.src = "mist.png";
          } 
          else if (condition.includes("rain")) 
          {
            weatherIcon.src = "rain.png";
          } 
          else if (condition.includes("thunder")) 
          {
            weatherIcon.src = "thunder.png";
          } 
          else if (condition.includes("snow")) 
          {
            weatherIcon.src = "snow.png";
          } 
          else if (condition.includes("fog") || condition.includes("haze")) 
          {
            weatherIcon.src = "fog.png";
          } 
          else if (condition.includes("patchy")) 
          {

            weatherIcon.src = "patchyrain.png";
          } 
          else 
          {
            weatherIcon.src = "default.png";
          }

          // Time
// ****************************
          // const datte = data.location.localtime
          // const timee = datte.split(" ")[1]
          // **********************
          // console.log(datte.split(" ")[1])

         //  converts the string into a real Date object.
         let localTime = new Date(data.location.localtime);
         let otherhours = localTime.getHours().toString().padStart(2, "0");
         let otherminutes = localTime.getMinutes().toString().padStart(2, "0");
         document.querySelector(".currentDay").innerHTML = `<i class="fa-solid fa-clock otherclock"></i> ${otherhours}:${otherminutes}`;
         

        
        let date = localTime.getDate();
        let months=localTime.getMonth()+1;
        let year=localTime.getFullYear();
        switch (months ) 
        {
        case 1:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} January ${year}`;
        break;
        case 2:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} February ${year}`;
        break;
        case 3:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} March ${year}`;
        break;
        case 4:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} April ${year}`;
        break;
        case 5:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} May ${year}`;
        break;
        case 6:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} June ${year}`;
        break;
        case 7:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} July ${year}`;
        break;
        case 8:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} August ${year}`;
        break;
        case 9:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} September ${year}`;
        break;
        case 10:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} October ${year}`;
        break;
        case 11:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} November ${year}`;
        break;
        case 12:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} December ${year}`;
        break;
        default:
        document.querySelector(".currentTime").innerHTML = `<i class="fa-solid fa-calendar otherclander"></i> ${date} ${year}`;
        }
        // document.querySelector(".currentTime").innerHTML = `${date}-${months}-${year}`;

//  document.querySelector(".currentDay").innerHTML=data.location.localtime
        //  let time= document.querySelector(".currentTime")


          document.querySelector(".inner-container").style.display = "flex";
          document.querySelector(".error").style.display = "none";
          document.querySelector("input").value = '';
        }
      } catch (err) {
        console.log(err);
      }
    }