(() => {
  let apiKey = '';
  const units = 'metric';

  // DOM Elements
  const apiKeyInput = document.getElementById('api-key-input');
  const setApiKeyBtn = document.getElementById('set-api-key');
  const apiStatus = document.getElementById('api-status');
  const apiSetup = document.getElementById('api-setup');
  const cityInput = document.getElementById('city-input');
  const searchForm = document.getElementById('search-form');
  const searchBtn = document.getElementById('search-btn');
  const locationEl = document.getElementById('location');
  const temperatureEl = document.getElementById('temperature');
  const weatherIconEl = document.getElementById('weather-icon');
  const weatherDescEl = document.getElementById('weather-description');
  const humidityEl = document.getElementById('humidity');
  const windSpeedEl = document.getElementById('wind-speed');
  const pressureEl = document.getElementById('pressure');
  const forecastEl = document.getElementById('forecast');
  const messageEl = document.getElementById('message');
  const favoritesList = document.getElementById('favorites-list');

  // Storage Keys
  const FAVORITES_KEY = 'weather_app_favorites';
  const API_KEY = 'weather_app_api_key';

  let favorites = [];

  // Load data from memory
  function loadData() {
    const storedApiKey = sessionStorage.getItem(API_KEY);
    if (storedApiKey) {
      apiKey = storedApiKey;
      apiKeyInput.value = storedApiKey;
      enableApp();
    }
    
    const storedFavorites = sessionStorage.getItem(FAVORITES_KEY);
    try {
      favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch(e) {
      favorites = [];
    }
  }

  // Save data to memory
  function saveApiKey() {
    sessionStorage.setItem(API_KEY, apiKey);
  }

  function saveFavorites() {
    sessionStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  // Enable app after API key is set
  function enableApp() {
    searchBtn.disabled = false;
    apiSetup.style.display = 'none';
    apiStatus.textContent = '✅ API key set successfully!';
    apiStatus.className = 'small text-success';
  }

  // API Key setup
  setApiKeyBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      apiStatus.textContent = '❌ Please enter an API key';
      apiStatus.className = 'small text-danger';
      return;
    }

    // Test the API key
    apiStatus.textContent = '🔄 Testing API key...';
    apiStatus.className = 'small text-info';
    
    try {
      const testResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${key}`);
      if (testResponse.ok) {
        apiKey = key;
        saveApiKey();
        enableApp();
      } else {
        throw new Error('Invalid API key');
      }
    } catch (error) {
      apiStatus.textContent = '❌ Invalid API key. Please check and try again.';
      apiStatus.className = 'small text-danger';
    }
  });

  // Render favorites list
  function renderFavorites() {
    favoritesList.innerHTML = '';
    if(favorites.length === 0) {
      favoritesList.textContent = 'No favorites saved.';
      return;
    }
    favorites.forEach(city => {
      const favBtn = document.createElement('button');
      favBtn.className = 'btn btn-primary d-flex align-items-center gap-2';
      favBtn.type = 'button';
      favBtn.setAttribute('aria-label', `View weather for ${city}`);
      favBtn.textContent = city;

      // Remove Button
      const rmBtn = document.createElement('span');
      rmBtn.className = 'remove-fav';
      rmBtn.innerHTML = '&times;';
      rmBtn.title = `Remove ${city} from favorites`;
      rmBtn.addEventListener('click', e => {
        e.stopPropagation();
        removeFavorite(city);
      });

      favBtn.appendChild(rmBtn);

      favBtn.addEventListener('click', () => {
        cityInput.value = city;
        fetchWeather(city);
      });

      favoritesList.appendChild(favBtn);
    });
  }

  // Add favorite
  function addFavorite(city) {
    if(!favorites.includes(city)) {
      favorites.push(city);
      saveFavorites();
      renderFavorites();
      showMessage(`Added ${city} to favorites.`, false);
    }
  }

  // Remove favorite
  function removeFavorite(city) {
    favorites = favorites.filter(c => c !== city);
    saveFavorites();
    renderFavorites();
    showMessage(`Removed ${city} from favorites.`, false);
  }

  // Show messages
  function showMessage(text, isError = true) {
    messageEl.textContent = text;
    messageEl.classList.toggle('text-danger', isError);
    messageEl.classList.toggle('text-success', !isError);
  }

  // Clear message
  function clearMessage() {
    messageEl.textContent = '';
  }

  // Format date string
  function formatDateTime(dt_txt) {
    const d = new Date(dt_txt);
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }

  // Set loading state
  function setLoading(loading) {
    if (loading) {
      searchBtn.textContent = 'Loading...';
      searchBtn.disabled = true;
      document.querySelector('main').classList.add('loading');
    } else {
      searchBtn.textContent = 'Search';
      searchBtn.disabled = false;
      document.querySelector('main').classList.remove('loading');
    }
  }

  // Fetch weather data from OpenWeatherMap API
  async function fetchWeather(city) {
    if (!apiKey) {
      showMessage('Please set your API key first.');
      return;
    }
    
    if (!city || city.trim() === '') {
      showMessage('Please enter a city name.');
      return;
    }
    
    clearMessage();
    clearWeatherDisplay();
    setLoading(true);

    // API endpoints
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;

    try {
      // Fetch current weather
      const currentResponse = await fetch(currentUrl);
      if (!currentResponse.ok) {
        if (currentResponse.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        } else if (currentResponse.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else {
          throw new Error('Unable to fetch weather data. Please try again.');
        }
      }
      const currentData = await currentResponse.json();

      // Fetch forecast
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) {
        throw new Error('Forecast data unavailable.');
      }
      const forecastData = await forecastResponse.json();

      displayCurrentWeather(currentData);
      displayForecast(forecastData);
      toggleAddFavButton(city);
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Clear weather display
  function clearWeatherDisplay() {
    locationEl.textContent = '';
    temperatureEl.textContent = '';
    weatherIconEl.src = '';
    weatherIconEl.alt = '';
    weatherIconEl.style.display = 'none';
    weatherDescEl.textContent = '';
    humidityEl.textContent = '';
    windSpeedEl.textContent = '';
    pressureEl.textContent = '';
    forecastEl.innerHTML = '';
    removeAddFavButton();
  }

  // Display current weather data
  function displayCurrentWeather(data) {
    locationEl.textContent = `${data.name}, ${data.sys.country}`;
    temperatureEl.textContent = `${Math.round(data.main.temp)}°${units === 'metric' ? 'C' : 'F'}`;
    weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIconEl.alt = data.weather[0].description;
    weatherIconEl.style.display = 'block';
    weatherDescEl.textContent = data.weather[0].description;
    humidityEl.textContent = `${data.main.humidity}%`;
    windSpeedEl.textContent = `${Math.round(data.wind.speed)} ${units === 'metric' ? 'm/s' : 'mph'}`;
    pressureEl.textContent = `${data.main.pressure} hPa`;
  }

  // Display 5 day forecast
  function displayForecast(data) {
    forecastEl.innerHTML = '';

    // Filter forecast for 12:00:00 entries
    const noonForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    noonForecasts.slice(0, 5).forEach(day => {
      const card = document.createElement('div');
      card.className = 'col';

      card.innerHTML = `
        <div class="forecast-day p-2">
          <div class="date fw-semibold">${formatDateTime(day.dt_txt)}</div>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}" />
          <div class="temp-range">${Math.round(day.main.temp_min)}° / ${Math.round(day.main.temp_max)}°</div>
        </div>
      `;

      forecastEl.appendChild(card);
    });
  }

  // Add or remove add favorite button
  function toggleAddFavButton(city) {
    let btn = document.getElementById('add-fav-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'add-fav-btn';
      btn.className = 'btn btn-success mt-3';
      btn.textContent = 'Add to Favorites';
      locationEl.after(btn);
      btn.addEventListener('click', () => {
        addFavorite(city);
        btn.disabled = true;
        btn.textContent = 'Added to Favorites';
      });
    }
    if (favorites.includes(city)) {
      btn.disabled = true;
      btn.textContent = 'Added to Favorites';
    } else {
      btn.disabled = false;
      btn.textContent = 'Add to Favorites';
    }
  }

  function removeAddFavButton() {
    const btn = document.getElementById('add-fav-btn');
    if (btn) btn.remove();
  }

  // Event listeners
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    fetchWeather(cityInput.value.trim());
  });

  // Allow Enter key in API key input
  apiKeyInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      setApiKeyBtn.click();
    }
  });

  // Initialize
  function init() {
    loadData();
    renderFavorites();
    clearMessage();
  }

  init();
})();