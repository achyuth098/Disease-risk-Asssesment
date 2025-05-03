from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import joblib
import numpy as np
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file in project root
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
if not os.path.exists(env_path):
    raise RuntimeError(f".env file not found at {env_path}")
load_dotenv(env_path)

app = FastAPI()

# Add CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
try:
    diabetes_model = joblib.load("models/diabetes_model.pkl")
    kidney_model = joblib.load("models/kidney_model.pkl")
except Exception as e:
    raise RuntimeError(f"Failed to load models: {str(e)}")

# Define input features for diabetes
class HealthInput(BaseModel):
    hba1c: float = Field(..., gt=0, le=15)
    glucose: float = Field(..., gt=0, le=300)
    bmi: float = Field(..., gt=0, le=50)
    weight: float = Field(..., gt=0, le=200)
    height: float = Field(..., gt=0, le=250)
    systolic_bp: float = Field(..., gt=0, le=200)
    diastolic_bp: float = Field(..., gt=0, le=120)
    cholesterol: float = Field(..., gt=0, le=400)
    ldl: float = Field(..., gt=0, le=300)
    egfr: float = Field(..., gt=0, le=120)
    age: float = Field(..., gt=0, le=100)

# Define input features for CKD
class CKDInput(BaseModel):
    age: float = Field(..., gt=0, le=100)
    egfr: float = Field(..., gt=0, le=120)
    albumin_creatinine: float = Field(..., ge=0, le=3000)
    glucose: float = Field(..., gt=0, le=300)
    hba1c: float = Field(..., gt=0, le=15)
    bmi: float = Field(..., gt=0, le=50)
    systolic_bp: float = Field(..., gt=0, le=200)
    diastolic_bp: float = Field(..., gt=0, le=120)
    encounter_count: float = Field(..., ge=0, le=100)

# Define input for recommendations
class RecommendationInput(BaseModel):
    disease: str
    risk_score: float
    age: float = Field(..., gt=0, le=100)
    hba1c: float = Field(..., gt=0, le=15)
    glucose: float = Field(..., gt=0, le=300)
    bmi: float = Field(..., gt=0, le=50)
    systolic_bp: float = Field(..., gt=0, le=200)
    diastolic_bp: float = Field(..., gt=0, le=120)
    egfr: float = Field(..., gt=0, le=120)
    albumin_creatinine: Optional[float] = Field(None, ge=0, le=3000)
    encounter_count: Optional[float] = Field(None, ge=0, le=100)

@app.post("/predict_diabetes")
def predict_diabetes_risk(data: HealthInput):
    try:
        features = np.array([[
            data.hba1c, data.glucose, data.bmi, data.weight, data.height,
            data.systolic_bp, data.diastolic_bp, data.cholesterol, data.ldl,
            data.egfr, data.age
        ]])
        risk = diabetes_model.predict_proba(features)[0][1]
        return {"risk_percentage": round(risk * 100, 2)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: Invalid input data - {str(e)}")

@app.post("/predict_kidney")
def predict_kidney_risk(data: CKDInput):
    try:
        features = np.array([[
            data.age, data.egfr, data.albumin_creatinine, data.glucose, data.hba1c,
            data.bmi, data.systolic_bp, data.diastolic_bp, data.encounter_count
        ]])
        risk = kidney_model.predict_proba(features)[0][1]
        return {"risk_percentage": round(risk * 100, 2)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: Invalid input data - {str(e)}")

def check_vital_ranges(data: RecommendationInput):
    vital_status = []
    age = data.age
    if data.hba1c >= 6.5:
        vital_status.append("HbA1c is high (diabetes range, normal <5.7%)")
    elif data.hba1c >= 5.7:
        vital_status.append("HbA1c is elevated (prediabetes range, normal <5.7%)")
    else:
        vital_status.append("HbA1c is within normal range (<5.7%)")
    if data.glucose >= 126:
        vital_status.append("Fasting glucose is high (diabetes range, normal 70–99 mg/dL)")
    elif data.glucose >= 100:
        vital_status.append("Fasting glucose is elevated (prediabetes range, normal 70–99 mg/dL)")
    else:
        vital_status.append("Fasting glucose is within normal range (70–99 mg/dL)")
    if data.bmi >= 30:
        vital_status.append("BMI indicates obesity (normal 18.5–24.9)")
    elif data.bmi >= 25:
        vital_status.append("BMI indicates overweight (normal 18.5–24.9)")
    else:
        vital_status.append("BMI is within normal range (18.5–24.9)")
    if data.systolic_bp >= 130 or data.diastolic_bp >= 80:
        vital_status.append("Blood pressure is high (hypertension, normal <120/<80 mm Hg)")
    elif data.systolic_bp >= 120:
        vital_status.append("Blood pressure is elevated (normal <120/<80 mm Hg)")
    else:
        vital_status.append("Blood pressure is within normal range (<120/<80 mm Hg)")
    if age < 40 and data.egfr < 90:
        vital_status.append("eGFR is below normal for your age group (<40 years, normal ≥90 mL/min/1.73m²)")
    elif age < 60 and data.egfr < 80:
        vital_status.append("eGFR is below normal for your age group (40–59 years, normal ≥80 mL/min/1.73m²)")
    elif age >= 60 and data.egfr < 70:
        vital_status.append("eGFR is below normal for your age group (60+ years, normal ≥70 mL/min/1.73m²)")
    else:
        vital_status.append("eGFR is within normal range for your age group")
    if data.disease == "kidneyDisease":
        if data.albumin_creatinine and data.albumin_creatinine > 300:
            vital_status.append("Albumin-creatinine ratio indicates macroalbuminuria (normal <30 mg/g)")
        elif data.albumin_creatinine and data.albumin_creatinine >= 30:
            vital_status.append("Albumin-creatinine ratio indicates microalbuminuria (normal <30 mg/g)")
        else:
            vital_status.append("Albumin-creatinine ratio is within normal range (<30 mg/g)")
        if data.encounter_count and data.encounter_count > 5:
            vital_status.append("High number of medical encounters (>5)")
        else:
            vital_status.append("Number of medical encounters is typical (≤5)")
    return vital_status

@app.post("/recommendations")
def get_recommendations(data: RecommendationInput):
    try:
        # Check vital ranges
        vital_status = check_vital_ranges(data)
        
        # Construct prompt for Mixtral-8x7B-Instruct
        prompt = (
            f"[INST] As a non-medical assistant, provide general, educational lifestyle tips for managing {data.disease} "
            f"with a risk score of {data.risk_score}% for a {int(data.age)}-year-old. "
            f"Current health status: {', '.join(vital_status)}. "
            f"Do not provide medical advice, diagnoses, or treatments. "
            f"Focus on diet, exercise, weight management, blood pressure control, and stress management. "
            f"Provide exactly 5 numbered tips (e.g., 1. Diet: ...), each complete, concise, and ending with a period. "
            f"Ensure a total word count of 120–150 words to avoid truncation. "
            f"End with: 'Consult a healthcare professional for personalized advice.' [/INST]"
        )
        
        # Call Hugging Face Inference API
        api_key = os.getenv("HUGGINGFACE_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail=f"Hugging Face API key not configured. Ensure HUGGINGFACE_API_KEY is set in {env_path}"
            )
        
        response = requests.post(
            "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "inputs": prompt,
                "parameters": {"max_new_tokens": 200, "return_full_text": False}
            }
        )
        
        if not response.ok:
            raise HTTPException(
                status_code=500,
                detail=f"Hugging Face API error: {response.status_code} - {response.text}"
            )
        
        recommendations = response.json()[0].get("generated_text", "No recommendations available")
        return {"recommendations": [recommendations]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")