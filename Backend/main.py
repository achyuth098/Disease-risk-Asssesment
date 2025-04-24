from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# Add CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
try:
    diabetes_model = joblib.load("models/diabetes_model.pkl")
    kidney_model = joblib.load("models/kidney_model.pkl")
except Exception as e:
    raise Exception(f"Failed to load models: {str(e)}")

# Define input features for diabetes
class HealthInput(BaseModel):
    hba1c: float
    glucose: float
    bmi: float
    weight: float
    height: float
    systolic_bp: float
    diastolic_bp: float
    cholesterol: float
    ldl: float
    egfr: float
    age: float

# Define input features for CKD
class CKDInput(BaseModel):
    age: float
    egfr: float
    albumin_creatinine: float
    glucose: float
    hba1c: float
    bmi: float
    systolic_bp: float
    diastolic_bp: float
    encounter_count: float

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
        raise HTTPException(status_code=500, detail=str(e))

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
        raise HTTPException(status_code=500, detail=str(e))