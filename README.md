# Disease Risk Assessment

A web application for assessing diabetes and kidney disease risk using machine learning models, built with a FastAPI backend and a React frontend. The application allows users to input demographic and health data to receive a risk percentage score.

---

## Project Structure

```
Disease-risk-Asssesment/
├── Backend/
│   ├── app.py                   # FastAPI backend with prediction endpoints
│   └── models/
│       ├── diabetes_model.pkl   # Pre-trained diabetes model
│       └── kidney_model.pkl     # Pre-trained kidney disease model
├── 
│   ├── src/
│   │   └── pages/
│   │       └── AssessmentPage.tsx  # React component for risk assessment UI
│   ├── package.json             # Frontend dependencies
│   └── vite.config.ts           # Vite configuration
└── README.md                    # Project documentation
```

---

## Prerequisites

Before setting up the application, ensure the following are installed on your Windows system:

- **Anaconda or Miniconda**: For managing Python environments. [Download](https://www.anaconda.com/)  
- **Node.js (version 18 or higher)**: For running the React frontend. [Download](https://nodejs.org/)  
- **Git**: For cloning the repository. [Download](https://git-scm.com/)  
- **VS Code (optional)**: For editing and managing the project. [Download](https://code.visualstudio.com/)  

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/achyuth098/Disease-risk-Asssesment.git  
cd Disease-risk-Asssesment  
```

### 2. Set Up the Backend (FastAPI)

The backend uses FastAPI to serve prediction endpoints (`/predict_diabetes`, `/predict_kidney`) with pre-trained machine learning models.

#### Step 2.1: Create and Activate Conda Environment

```bash
conda create -n diabetes-api python=3.8  
conda activate diabetes-api  
```

#### Step 2.2: Install Backend Dependencies

```bash
pip install fastapi uvicorn joblib numpy pydantic scikit-learn==1.6.1  
```

#### Step 2.3: Verify Model Files

Ensure the pre-trained model files are present in `Backend/models/`:

- `diabetes_model.pkl`  
- `kidney_model.pkl`  

If missing, contact the project maintainer or retrain the models using scikit-learn 1.6.1.

---

### 3. Set Up the Frontend (React)

The frontend is a React application built with Vite, displaying the risk assessment interface.

#### Step 3.1: Navigate to Frontend Directory

```bash
cd directory_name  
```

#### Step 3.2: Install Frontend Dependencies

```bash
npm install  
```

If you encounter a "running scripts is disabled" error:

```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned  
```

Then retry `npm install`.

#### Step 3.3: Verify Frontend Files

Ensure the following files are present and up-to-date:

- `your_directory/src/pages/AssessmentPage.tsx`  
- `your_directory/package.json` (includes `vite@6.3.4` and other dependencies)  

---

## Running the Application

### Step 1: Start the FastAPI Backend

```bash
conda activate diabetes-api  
cd C:your_directory\Disease-risk-Asssesment-main  
uvicorn Backend.app:app --host 127.0.0.1 --port 8000  
```

Keep this terminal running.

### Step 2: Start the React Frontend

Open a new terminal:

```bash
cd your_directory  
npm run dev  
```

Visit: [http://localhost:8080](http://localhost:8080)

---

## Testing the Application

### Open the Application

Visit: [http://localhost:8080/assessment/diabetes](http://localhost:8080/assessment/diabetes)

### Perform a Diabetes Risk Assessment

- **Demographics**:  
  - Age: `50`  
  - Gender: `male`  
  - Zip Code: `12345`  
  - Urban/Rural: `urban`  
- **Health Metrics**:  
  - hba1c: `5.5`  
  - glucose: `100`  
  - weight: `70`  
  - height: `170`  
  - systolic_bp: `120`  
  - diastolic_bp: `80`  
  - cholesterol: `200`  
  - ldl: `130`  
  - egfr: `60`  

Click **Complete** and verify:

- A risk score is displayed (e.g., `51%`)  
- No 404 errors  
- Browser console logs:
  - `Sending data`  
  - `Prediction response`  
  - `Assessment saved successfully` (if Supabase is configured)  

### Check Backend Logs

Ensure the Uvicorn terminal shows no errors.

---

## Project Structure

```
Disease-risk-Asssesment/
├── Backend/
│   ├── app.py                   # FastAPI backend with prediction endpoints
│   └── models/
│       ├── diabetes_model.pkl   # Pre-trained diabetes model
│       └── kidney_model.pkl     # Pre-trained kidney disease model
├── Frontend/
│   ├── src/
│   │   └── pages/
│   │       └── AssessmentPage.tsx  # React component for risk assessment UI
│   ├── package.json             # Frontend dependencies
│   └── vite.config.ts           # Vite configuration
└── README.md                    # Project documentation
```

---

## Troubleshooting

### 404 Error for Recommendations

- Ensure `src/pages/AssessmentPage.tsx` does not fetch `/recommendations`  
- Verify `Backend/app.py` does not include `/recommendations` endpoint  

### Model Loading Errors

- Confirm `diabetes_model.pkl` and `kidney_model.pkl` are in `Backend/models/`  
- Ensure `scikit-learn==1.6.1` is installed:

```bash
pip show scikit-learn  
```

### Frontend Dependency Issues

- Run:

```bash
npm audit fix  
```

- Verify `vite@6.3.4` in `package.json`  

### Backend Startup Errors

- Check Uvicorn logs  
- Ensure the Conda environment is activated:

```bash
conda activate diabetes-api  
```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
