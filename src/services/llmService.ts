import axios from "axios";

export interface CropRecommendation {
  name: string;
  score: number;
  icon: string;
  season: string;
  reason?: string;
}

export const getSoilAdvisorRecommendations = async (
  ph: number,
  moisture: number,
  nitrogen: number,
  phosphorus: number,
  potassium: number
): Promise<CropRecommendation[]> => {
  try {
    // With actual Groq API key, you can use it like this:
    // const apiKey = process.env.GROQ_API_KEY;
    // Make API call to Groq endpoint
    // For now, return mock recommendations based on soil parameters
    
    const recommendations = generateRecommendations(ph, moisture, nitrogen, phosphorus, potassium);
    return recommendations;
  } catch (error) {
    console.error("LLM error:", error);
    return getMockCropRecommendations();
  }
};

const generateRecommendations = (
  ph: number,
  moisture: number,
  nitrogen: number,
  phosphorus: number,
  potassium: number
): CropRecommendation[] => {
  const crops: CropRecommendation[] = [
    { name: "Rice (धान)", score: 95, icon: "🌾", season: "Kharif" },
    { name: "Sugarcane (ऊस)", score: 88, icon: "🎋", season: "Annual" },
    { name: "Soybean (सोयाबीन)", score: 82, icon: "🫘", season: "Kharif" },
    { name: "Cotton (कापूस)", score: 75, icon: "☁️", season: "Kharif" },
  ];

  // Adjust scores based on soil parameters
  if (ph < 6 || ph > 7.5) {
    crops.forEach(c => c.score -= 10);
  }
  if (moisture < 30 || moisture > 60) {
    crops.forEach(c => c.score -= 5);
  }

  return crops.sort((a, b) => b.score - a.score);
};

const getMockCropRecommendations = (): CropRecommendation[] => {
  return [
    { name: "Rice (धान)", score: 95, icon: "🌾", season: "Kharif" },
    { name: "Sugarcane (ऊस)", score: 88, icon: "🎋", season: "Annual" },
    { name: "Soybean (सोयाबीन)", score: 82, icon: "🫘", season: "Kharif" },
    { name: "Cotton (कापूस)", score: 75, icon: "☁️", season: "Kharif" },
  ];
};

export interface DiseaseDetectionResult {
  disease: string;
  severity: string;
  advice: string;
  organicSolution?: string;
  pesticide?: string;
}

export const detectPlantDisease = async (
  imageDescription: string
): Promise<DiseaseDetectionResult> => {
  try {
    // Keyword matching to identify common diseases
    const description = imageDescription.toLowerCase();
    
    if (description.includes("yellow") && description.includes("spot")) {
      return {
        disease: "Leaf Spot (येलो लीफ स्पॉट)",
        severity: "Moderate",
        advice: "Remove affected leaves and improve air circulation",
        organicSolution: "Spray neem oil (3%) every 7 days",
        pesticide: "Mancozeb 75% WP - 2.5g/liter"
      };
    }
    
    if (description.includes("blight") || description.includes("brown")) {
      return {
        disease: "Leaf Blight (लीफ ब्लाइट)",
        severity: "Severe",
        advice: "Isolate plant, remove infected parts immediately",
        organicSolution: "Apply neem oil spray in early morning",
        pesticide: "Copper sulfate solution - 1% concentration"
      };
    }
    
    if (description.includes("powdery") || description.includes("white")) {
      return {
        disease: "Powdery Mildew (पाउडरी मिल्ड्यू)",
        severity: "Mild",
        advice: "Increase air circulation, reduce humidity",
        organicSolution: "Spray sulfur dust or potassium bicarbonate",
        pesticide: "Sulfur 80% WP - 2g/liter"
      };
    }
    
    if (description.includes("rust") || description.includes("orange")) {
      return {
        disease: "Rust (रस्ट)",
        severity: "Moderate",
        advice: "Remove infected leaves, improve drainage",
        organicSolution: "Apply sulfur spray regularly",
        pesticide: "Mancozeb 75% WP - 2.5g/liter"
      };
    }

    // Default disease detection
    return {
      disease: "Leaf Disease (पत्ती रोग)",
      severity: "Moderate",
      advice: "Monitor plant closely and improve growing conditions",
      organicSolution: "Apply general fungicide like neem oil",
      pesticide: "Consult local agricultural officer"
    };
  } catch (error) {
    console.error("Disease detection error:", error);
    return getMockDiseaseDetection();
  }
};

const getMockDiseaseDetection = (): DiseaseDetectionResult => {
  return {
    disease: "Leaf Blight",
    severity: "Moderate",
    advice: "Isolate affected plants and apply fungicide treatment",
    organicSolution: "Apply neem oil spray (5ml per liter of water) in early morning",
    pesticide: "Mancozeb 75% WP — 2.5g per liter",
  };
};
