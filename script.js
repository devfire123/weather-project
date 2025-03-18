const getEl = (selector) => document.querySelector(selector);
const [container, search, weatherBox, weatherDetails, error404, cityInput, apiStatus] = 
    ['.container', '.search-box button', '.weather-box', '.weather-details', '.not-found', '.search-box input', '.api-status .status'].map(getEl);

const APIKey = 'a7c899a9ac1542ba862185905251403';
const fetchWeather = async (city) => {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${APIKey}&q=${city}&aqi=no`);
        const data = await res.json();
        if (data.error) return showError();
        updateUI(data);
    } catch { showError(); }
};

const showError = () => {
    Object.assign(container.style, { height: '400px' });
    weatherBox.style.display = weatherDetails.style.display = 'none';
    error404.style.display = 'block';
};

const updateUI = (data) => {
    error404.style.display = 'none';
    getEl('.weather-box img').src = `https:${data.current.condition.icon}`;
    getEl('.weather-box .temperature').innerHTML = `${Math.round(data.current.temp_c)}<span>°C</span>`;
    getEl('.weather-box .description').innerHTML = data.current.condition.text;
    getEl('.weather-details .humidity span').innerHTML = `${data.current.humidity}%`;
    getEl('.weather-details .wind span').innerHTML = `${data.current.wind_kph} km/h`;
    Object.assign(container.style, { height: '590px' });
    weatherBox.style.display = 'block';
    weatherDetails.style.display = 'flex';
};

const checkApiStatus = async () => {
    try {
        apiStatus.textContent = 'Checking...';
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${APIKey}&q=London&aqi=no`);
        apiStatus.textContent = res.ok ? 'Connected' : `Error: ${res.status}`;
        apiStatus.style.color = res.ok ? 'green' : 'red';
        return res.ok;
    } catch {
        apiStatus.textContent = 'Connection Failed';
        apiStatus.style.color = 'red';
        return false;
    }
};

const handleSearch = () => cityInput.value.trim() && fetchWeather(cityInput.value.trim());
search.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleSearch());

window.addEventListener('load', async () => (await checkApiStatus()) && fetchWeather(cityInput.value.trim() || 'London'));
