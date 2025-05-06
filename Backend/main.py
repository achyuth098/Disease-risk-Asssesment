from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os

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
    heart_model = joblib.load("models/heart_model.pkl")
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

# Define input features for heart disease
class HeartInput(BaseModel):
    egfr: float = Field(..., gt=0, le=120)
    albumin_creatinine: float = Field(..., ge=0, le=3000)
    glucose: float = Field(..., gt=0, le=300)
    hba1c: float = Field(..., gt=0, le=15)
    bmi: float = Field(..., gt=0, le=50)
    systolic_bp: float = Field(..., gt=0, le=200)
    diastolic_bp: float = Field(..., gt=0, le=120)
    cholesterol: float = Field(..., gt=0, le=400)
    ldl: float = Field(..., gt=0, le=300)
    smoking_status: float = Field(..., ge=0, le=1)  # 0: non-smoker, 1: smoker
    encounter_count: float = Field(..., ge=0, le=100)
    gender: float = Field(..., ge=0, le=1)  # 0: female, 1: male

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

@app.post("/predict_heart")
def predict_heart_risk(data: HeartInput):
    try:
        features = np.array([[
            data.egfr, data.albumin_creatinine, data.glucose, data.hba1c,
            data.bmi, data.systolic_bp, data.diastolic_bp, data.cholesterol,
            data.ldl, data.smoking_status, data.encounter_count, data.gender
        ]])
        risk = heart_model.predict_proba(features)[0][1]
        return {"risk_percentage": round(risk * 100, 2)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: Invalid input data - {str(e)}")