import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { getWeatherForecast } from "../services/weatherService.js";

export const getWeather = async (req: AuthRequest, res: Response) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    const weatherData = await getWeatherForecast(location as string);
    res.json(weatherData);
  } catch (error) {
    console.error("Weather error:", error);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
};
