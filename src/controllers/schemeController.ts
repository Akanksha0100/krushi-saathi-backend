import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import {
  getGovernmentSchemes,
  addGovernmentScheme,
  updateGovernmentScheme,
  deleteGovernmentScheme,
} from "../services/govSchemesService.js";

export const getSchemes = async (req: AuthRequest, res: Response) => {
  try {
    const schemes = await getGovernmentSchemes();
    res.json(schemes);
  } catch (error) {
    console.error("Get schemes error:", error);
    res.status(500).json({ error: "Failed to fetch schemes" });
  }
};

export const createScheme = async (req: AuthRequest, res: Response) => {
  try {
    const schemeData = req.body;

    if (!schemeData.name || !schemeData.description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    const scheme = await addGovernmentScheme(schemeData);
    res.status(201).json(scheme);
  } catch (error) {
    console.error("Create scheme error:", error);
    res.status(500).json({ error: "Failed to create scheme" });
  }
};

export const updateScheme = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const schemeData = req.body;
    const schemeId = typeof id === "string" ? id : id[0];

    const scheme = await updateGovernmentScheme(schemeId, schemeData);
    res.json(scheme);
  } catch (error) {
    console.error("Update scheme error:", error);
    res.status(500).json({ error: "Failed to update scheme" });
  }
};

export const deleteScheme = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const schemeId = typeof id === "string" ? id : id[0];

    await deleteGovernmentScheme(schemeId);
    res.json({ message: "Scheme deleted" });
  } catch (error) {
    console.error("Delete scheme error:", error);
    res.status(500).json({ error: "Failed to delete scheme" });
  }
};
