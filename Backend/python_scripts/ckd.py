# Save as app.py (or similar) in your local environment or Colab
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

# Initialize FastAPI app
app = FastAPI(title="Kidney Disease Prediction API")

# Define input schema with Pydantic
class PatientData(BaseModel):
    egfr: float
    albumin_creatinine: float
    glucose: float
    hba1c: float
    bmi: float
    systolic_bp: float
    diastolic_bp: float
    encounter_count: float
    AGE: float

# Load the trained model
try:
    model = joblib.load("ckd_model.pkl")
except Exception as e:
    raise Exception(f"Failed to load model: {str(e)}")

# Root endpoint for health check
@app.get("/")
def read_root():
    return {"message": "Kidney Disease Prediction API is running"}

# Predict endpoint
@app.post("/predict")
def predict(data: PatientData):
    try:
        # Convert Pydantic model to DataFrame
        input_dict = data.model_dump()
        input_df = pd.DataFrame([input_dict])
        
        # Ensure correct column order
        feature_order = ["egfr", "albumin_creatinine", "glucose", "hba1c", "bmi", 
                        "systolic_bp", "diastolic_bp", "encounter_count", "AGE"]
        input_df = input_df[feature_order]
        
        # Make prediction
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1] * 100  # Probability of CKD
        
        return {
            "prediction": int(prediction),  # 0 (no CKD) or 1 (CKD)
            "probability": float(probability)  # % chance of CKD
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")