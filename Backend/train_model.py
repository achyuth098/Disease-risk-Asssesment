import pandas as pd
import numpy as np
import joblib
from datetime import datetime
import os

# For modeling
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.ensemble import RandomForestClassifier

def train_and_save_model():
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        DATA_DIR = os.path.join(BASE_DIR, "Data")

        patients = pd.read_csv(os.path.join(DATA_DIR, "patients.csv"))
        conditions = pd.read_csv(os.path.join(DATA_DIR, "conditions.csv"))
        observations = pd.read_csv(os.path.join(DATA_DIR, "observations.csv"))

        print("Patients shape:", patients.shape)
        print("Conditions shape:", conditions.shape)
        print("Observations shape:", observations.shape)

        # Step 1: define T2DM codes
        t2dm_codes = ["44054006"]  # T2DM

        # Step 2: filter conditions for T2DM
        t2dm_rows = conditions[conditions["CODE"].astype(str).isin(t2dm_codes)]

        # Step 3: build a set of T2DM patient IDs
        t2dm_patient_ids = set(t2dm_rows["PATIENT"])
        print("Total T2DM patients:", len(t2dm_patient_ids))

        # Step 4: label each patient
        patients["diabetes_label"] = patients["Id"].apply(
            lambda pid: 1 if pid in t2dm_patient_ids else 0
        )
        print("Label distribution:\n", patients["diabetes_label"].value_counts())

        # Feature mapping
        feature_map = {
            "Hemoglobin A1c/Hemoglobin.total in Blood": "hba1c",
            "Glucose [Mass/volume] in Blood": "glucose",
            "Body mass index (BMI) [Ratio]": "bmi",
            "Body Weight": "weight",
            "Body Height": "height",
            "Systolic Blood Pressure": "systolic_bp",
            "Diastolic Blood Pressure": "diastolic_bp",
            "Cholesterol [Mass/volume] in Serum or Plasma": "cholesterol",
            "Low Density Lipoprotein Cholesterol": "ldl",
            "Glomerular filtration rate/1.73 sq M.predicted [Volume Rate/Area] in Serum or Plasma by Creatinine-based formula (MDRD)": "egfr"
        }

        # Filter observations
        obs_filtered = observations[observations["DESCRIPTION"].isin(feature_map.keys())].copy()

        # Rename columns to a new "feature" column
        obs_filtered["feature"] = obs_filtered["DESCRIPTION"].map(feature_map)

        # Convert VALUE to numeric
        obs_filtered["VALUE"] = pd.to_numeric(obs_filtered["VALUE"], errors="coerce")

        # Convert DATE to datetime
        obs_filtered["DATE"] = pd.to_datetime(obs_filtered["DATE"], errors="coerce")

        # Take the LATEST value per patient-feature
        obs_filtered.sort_values("DATE", inplace=True)
        latest_obs = obs_filtered.groupby(["PATIENT", "feature"], as_index=False).last()

        # Pivot to wide form: one row per patient, columns = features
        patient_features = latest_obs.pivot(index="PATIENT", columns="feature", values="VALUE").reset_index()
        patient_features.rename(columns={"PATIENT": "Id"}, inplace=True)

        print("Patient features shape:", patient_features.shape)

        # Merge with patients data
        final_df = pd.merge(patients, patient_features, on="Id", how="left")

        # Calculate age
        final_df["AGE"] = pd.to_datetime(final_df["BIRTHDATE"], errors="coerce").apply(
            lambda dob: datetime.now().year - dob.year if pd.notnull(dob) else np.nan
        )

        # Select and clean columns
        columns_to_keep = [
            "Id", "diabetes_label", "AGE",
            "glucose", "hba1c", "bmi", "ldl", "cholesterol",
            "systolic_bp", "diastolic_bp", "egfr", "weight", "height"
        ]
        final_df_cleaned = final_df[columns_to_keep]

        # Fill numeric columns with mean
        lab_cols = [
            "glucose", "hba1c", "bmi", "ldl", "cholesterol",
            "systolic_bp", "diastolic_bp", "egfr", "weight", "height"
        ]
        final_df_cleaned[lab_cols] = final_df_cleaned[lab_cols].fillna(final_df_cleaned[lab_cols].mean())

        # Prepare features and target
        X = final_df_cleaned[lab_cols + ["AGE"]]
        y = final_df_cleaned["diabetes_label"]

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, stratify=y, random_state=42
        )

        # Train model
        print("Training model...")
        model = RandomForestClassifier(
            n_estimators=100,
            class_weight="balanced_subsample",
            random_state=42
        )
        model.fit(X_train, y_train)

        # Evaluate model
        y_pred = model.predict(X_test)
        print("\nModel Evaluation:")
        print(classification_report(y_test, y_pred))

        # Save model
        os.makedirs('models', exist_ok=True)
        model_path = os.path.join('models', 'diabetes_model.pkl')
        joblib.dump(model, model_path)
        print(f"\nModel saved to {model_path}")

    except Exception as e:
        print(f"Error during model training: {str(e)}")
        raise

if __name__ == "__main__":
    train_and_save_model()
