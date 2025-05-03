import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// This is where you would normally load the model
// For Deno, we need to handle it differently than with Python/Node.js
// Here's a placeholder where you'll add your model loading code
let model: any = null;

// Function to load the model (placeholder)
async function loadModel() {
  // This is where you would load your model
  // For demonstration purposes, we'll just create a simple prediction function
  console.log("Model would be loaded here in production");
  
  // Instead of actually loading the model, we'll create a function that mimics
  // what your Random Forest Classifier might do
  model = {
    predict_proba: (features: any[]) => {
      // Simulate prediction - in real implementation this would use the actual model
      // This is a placeholder that returns a risk score based on some rules
      
      // Extract features from the input array
      const [hba1c, glucose, bmi, weight, height, systolicBp, diastolicBp, cholesterol, ldl, egfr, age, gender] = features[0];
      
      // Get a base risk score (higher if key values are concerning)
      let baseRisk = 0;
      
      // HbA1c contribution (very important for diabetes)
      if (hba1c > 6.5) baseRisk += 30;
      else if (hba1c > 5.7) baseRisk += 15;
      
      // Glucose contribution
      if (glucose > 126) baseRisk += 20;
      else if (glucose > 100) baseRisk += 10;
      
      // BMI contribution
      if (bmi > 30) baseRisk += 10;
      else if (bmi > 25) baseRisk += 5;
      
      // Blood pressure contribution
      if (systolicBp > 140 || diastolicBp > 90) baseRisk += 10;
      else if (systolicBp > 120 || diastolicBp > 80) baseRisk += 5;
      
      // Cholesterol contribution
      if (cholesterol > 240 || ldl > 160) baseRisk += 10;
      else if (cholesterol > 200 || ldl > 130) baseRisk += 5;
      
      // eGFR contribution (kidney function)
      if (egfr < 60) baseRisk += 10;
      
      // Age contribution (new)
      if (age > 65) baseRisk += 15;
      else if (age > 50) baseRisk += 10;
      else if (age > 40) baseRisk += 5;
      
      // Gender contribution (new - men have slightly higher risk for diabetes)
      if (gender === 'male') baseRisk += 2;
      
      // Add some randomness to simulate model variation (±10%)
      const randomFactor = Math.random() * 20 - 10;
      let riskScore = Math.min(Math.max(baseRisk + randomFactor, 5), 95);
      
      // Return probability in format [probability_of_class_0, probability_of_class_1]
      return [[1 - riskScore/100, riskScore/100]];
    }
  };
  
  return model;
}

// Process features into format expected by model
function processFeatures(data: any) {
  // Extract features in the order expected by your model
  const features = [
    parseFloat(data.hba1c || "0"),
    parseFloat(data.glucose || "0"),
    parseFloat(data.bmi || "0"),
    parseFloat(data.weight || "0"),
    parseFloat(data.height || "0"),
    parseFloat(data.systolic_bp || "0"),
    parseFloat(data.diastolic_bp || "0"),
    parseFloat(data.cholesterol || "0"),
    parseFloat(data.ldl || "0"),
    parseFloat(data.egfr || "0"),
    parseFloat(data.age || "0"),  // New demographic feature
    data.gender || ""             // New demographic feature
  ];
  
  // Ensure all features are valid numbers
  const validFeatures = features.map((f, index) => {
    // For gender (which is a string), keep as is
    if (index === 11) return f;
    // For numeric values, ensure they're valid numbers
    return isNaN(f) ? 0 : f;
  });
  
  return [validFeatures]; // Model expects 2D array for batch predictions
}

// Initialize model on first run
await loadModel();

serve(async (req) => {
  // IMPORTANT: Handle OPTIONS requests (CORS preflight)
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { 
      status: 204, // No content status for preflight
      headers: corsHeaders 
    });
  }

  try {
    console.log("Received request method:", req.method);
    
    // Get prediction data from request
    const data = await req.json();
    console.log("Received request data:", data);
    
    // Ensure model is loaded
    if (!model) {
      await loadModel();
    }
    
    // Process features for prediction
    const processedFeatures = processFeatures(data);
    
    // Make prediction
    const prediction = model.predict_proba(processedFeatures);
    
    // Get the probability of class 1 (the risk probability)
    const riskProbability = prediction[0][1];
    
    // Convert to percentage and round to 2 decimal places
    const riskPercentage = Math.round(riskProbability * 100);
    
    // Determine risk level
    let riskLevel = "low";
    if (riskPercentage > 66) {
      riskLevel = "high";
    } else if (riskPercentage > 33) {
      riskLevel = "moderate";
    }
    
    console.log("Risk calculation complete:", { riskPercentage, riskLevel });
    
    // Return prediction result
    return new Response(
      JSON.stringify({
        success: true,
        riskScore: riskPercentage,
        riskLevel: riskLevel,
        message: `Risk assessment completed successfully.`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error making prediction:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to process prediction request"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
