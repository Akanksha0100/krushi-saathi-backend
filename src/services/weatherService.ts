import axios from "axios";

export interface WeatherData {
  location: string;
  forecast: Array<{
    day: string;
    temp: number;
    rain: number;
    icon: string;
  }>;
}

export const getWeatherForecast = async (location: string): Promise<WeatherData> => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // Get coordinates from location
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`
    );

    if (!geoResponse.data.length) {
      throw new Error("Location not found");
    }

    const { lat, lon } = geoResponse.data[0];

    // Get weather forecast
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const forecastData = weatherResponse.data.list;
    const dailyForecasts = new Map<string, any>();

    // Process forecast data (get one entry per day)
    forecastData.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      
      if (!dailyForecasts.has(day)) {
        dailyForecasts.set(day, {
          day,
          temp: Math.round(item.main.temp),
          rain: item.clouds.all,
          icon: mapWeatherIcon(item.weather[0].main),
        });
      }
    });

    return {
      location: `${geoResponse.data[0].name}, ${geoResponse.data[0].country}`,
      forecast: Array.from(dailyForecasts.values()).slice(0, 7),
    };
  } catch (error) {
    console.error("Weather API error:", error);
    // Return mock data if API fails
    return getMockWeatherData(location);
  }
};

const mapWeatherIcon = (condition: string): string => {
  const iconMap: Record<string, string> = {
    Clear: "☀️",
    Clouds: "🌤️",
    Rain: "🌧️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
  };
  return iconMap[condition] || "🌤️";
};

const getMockWeatherData = (location: string): WeatherData => {
  return {
    location,
    forecast: [
      { day: "Mon", temp: 28, rain: 20, icon: "🌤️" },
      { day: "Tue", temp: 30, rain: 10, icon: "☀️" },
      { day: "Wed", temp: 27, rain: 60, icon: "🌧️" },
      { day: "Thu", temp: 25, rain: 80, icon: "⛈️" },
      { day: "Fri", temp: 26, rain: 40, icon: "🌦️" },
      { day: "Sat", temp: 29, rain: 15, icon: "🌤️" },
      { day: "Sun", temp: 31, rain: 5, icon: "☀️" },
    ],
  };
};
