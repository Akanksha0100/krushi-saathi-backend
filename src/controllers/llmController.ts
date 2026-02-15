import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { getSoilAdvisorRecommendations, detectPlantDisease } from "../services/llmService.js";

export const getSoilAdvisor = async (req: AuthRequest, res: Response) => {
  try {
    const { ph, moisture, nitrogen, phosphorus, potassium } = req.body;

    if (ph === undefined || moisture === undefined || nitrogen === undefined || 
        phosphorus === undefined || potassium === undefined) {
      return res.status(400).json({ error: "All soil parameters are required" });
    }

    const recommendations = await getSoilAdvisorRecommendations(
      parseFloat(ph),
      parseFloat(moisture),
      parseFloat(nitrogen),
      parseFloat(phosphorus),
      parseFloat(potassium)
    );

    res.json({ recommendedCrops: recommendations });
  } catch (error) {
    console.error("Soil advisor error:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
};

export const detectDisease = async (req: AuthRequest, res: Response) => {
  try {
    const { imageDescription } = req.body;

    if (!imageDescription) {
      return res.status(400).json({ error: "Image description is required" });
    }

    const result = await detectPlantDisease(imageDescription);
    res.json(result);
  } catch (error) {
    console.error("Disease detection error:", error);
    res.status(500).json({ error: "Failed to detect disease" });
  }
};
