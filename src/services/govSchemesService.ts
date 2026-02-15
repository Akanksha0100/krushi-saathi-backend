import { GovScheme } from "../models/GovScheme.js";

export interface GovernmentSchemeResponse {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  benefit: string;
  icon: string;
  url?: string;
}

export const getGovernmentSchemes = async (): Promise<GovernmentSchemeResponse[]> => {
  try {
    const schemes = await GovScheme.find().lean();
    return schemes.map((scheme) => ({
      id: scheme._id?.toString() || "",
      name: scheme.name,
      description: scheme.description,
      eligibility: scheme.eligibility,
      benefit: scheme.benefit,
      icon: scheme.icon,
      url: scheme.url,
    }));
  } catch (error) {
    console.error("Error fetching schemes:", error);
    return getDefaultGovernmentSchemes();
  }
};

export const getDefaultGovernmentSchemes = (): GovernmentSchemeResponse[] => {
  return [
    {
      id: "1",
      name: "PM Kisan Samman Nidhi",
      description: "Direct income support to farmers",
      eligibility: "All landholding farmers",
      benefit: "₹6000/year in 3 installments",
      icon: "🌾",
      url: "https://pmkisan.gov.in/",
    },
    {
      id: "2",
      name: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance scheme",
      eligibility: "Farmers with agricultural land",
      benefit: "Insurance coverage for crop losses",
      icon: "🛡️",
      url: "https://pmfby.gov.in/",
    },
    {
      id: "3",
      name: "Pradhan Mantri Kisan Mandhan Yojana",
      description: "Pension scheme for farmers",
      eligibility: "Small and marginal farmers (18-40 years)",
      benefit: "₹3000/month pension",
      icon: "💰",
    },
    {
      id: "4",
      name: "Soil Health Card Scheme",
      description: "Free soil testing and recommendations",
      eligibility: "All farmers",
      benefit: "Free soil analysis and nutrient guidance",
      icon: "📊",
    },
    {
      id: "5",
      name: "Pradhan Mantri Kisan Sinchayee Yojana",
      description: "Irrigation infrastructure development",
      eligibility: "Farmers with agricultural land",
      benefit: "Subsidized irrigation equipment",
      icon: "💧",
    },
    {
      id: "6",
      name: "eNAM - e-National Agriculture Market",
      description: "Digital marketplace for agricultural products",
      eligibility: "All farmers and traders",
      benefit: "Better market access and fair prices",
      icon: "🛒",
      url: "https://enam.gov.in/",
    },
  ];
};

export const addGovernmentScheme = async (
  schemeData: any
): Promise<GovernmentSchemeResponse> => {
  try {
    const scheme = new GovScheme(schemeData);
    await scheme.save();
    return {
      id: scheme._id?.toString() || "",
      name: scheme.name,
      description: scheme.description,
      eligibility: scheme.eligibility,
      benefit: scheme.benefit,
      icon: scheme.icon,
      url: scheme.url,
    };
  } catch (error) {
    console.error("Error adding scheme:", error);
    throw error;
  }
};

export const updateGovernmentScheme = async (
  id: string,
  schemeData: any
): Promise<GovernmentSchemeResponse> => {
  try {
    const scheme = await GovScheme.findByIdAndUpdate(id, schemeData, {
      new: true,
    }).lean();
    if (!scheme) throw new Error("Scheme not found");
    return {
      id: scheme._id?.toString() || "",
      name: scheme.name,
      description: scheme.description,
      eligibility: scheme.eligibility,
      benefit: scheme.benefit,
      icon: scheme.icon,
      url: scheme.url,
    };
  } catch (error) {
    console.error("Error updating scheme:", error);
    throw error;
  }
};

export const deleteGovernmentScheme = async (id: string): Promise<void> => {
  try {
    await GovScheme.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting scheme:", error);
    throw error;
  }
};
