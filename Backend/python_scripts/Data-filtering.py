import pandas as pd
import os

# Define file paths
data_path = "/content/drive/MyDrive/Datasets for diabetes/"
output_path = "/content/drive/MyDrive/Datasets for diabetes/output/"

# Ensure output folder exists
os.makedirs(output_path, exist_ok=True)

# Load datasets
patients_df = pd.read_csv(f"{data_path}patients.csv")
conditions_df = pd.read_csv(f"{data_path}conditions.csv")
procedures_df = pd.read_csv(f"{data_path}procedures.csv")
encounters_df = pd.read_csv(f"{data_path}encounters.csv")
observations_df = pd.read_csv(f"{data_path}observations.csv")
medications_df = pd.read_csv(f"{data_path}medications.csv")

# Filter diabetes patients from conditions.csv
diabetes_conditions = conditions_df[
    conditions_df["DESCRIPTION"].str.contains("diabetes", case=False, na=False)
]

# Get unique patient IDs with diabetes
diabetes_patient_ids = diabetes_conditions["PATIENT"].unique()

# Filter relevant records from all datasets
diabetes_patients = patients_df[patients_df["Id"].isin(diabetes_patient_ids)]
diabetes_procedures = procedures_df[procedures_df["PATIENT"].isin(diabetes_patient_ids)]
diabetes_encounters = encounters_df[encounters_df["PATIENT"].isin(diabetes_patient_ids)]
diabetes_observations = observations_df[observations_df["PATIENT"].isin(diabetes_patient_ids)]
diabetes_medications = medications_df[medications_df["PATIENT"].isin(diabetes_patient_ids)]

# Save filtered data to new CSV files
diabetes_patients.to_csv(f"{output_path}diabetes_patients.csv", index=False)
diabetes_conditions.to_csv(f"{output_path}diabetes_conditions.csv", index=False)
diabetes_procedures.to_csv(f"{output_path}diabetes_procedures.csv", index=False)
diabetes_encounters.to_csv(f"{output_path}diabetes_encounters.csv", index=False)
diabetes_observations.to_csv(f"{output_path}diabetes_observations.csv", index=False)
diabetes_medications.to_csv(f"{output_path}diabetes_medications.csv", index=False)

print("Filtered diabetes-related data has been successfully extracted and saved in Google Drive.")
