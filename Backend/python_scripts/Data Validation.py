import sqlite3

# Connecting to SQLite database
conn = sqlite3.connect("synthea_diabetes.db")
cursor = conn.cursor()



#Checking if every condition's PATIENT exists in the patients table
cursor.execute("""
    SELECT COUNT(*) FROM conditions
    WHERE PATIENT NOT IN (SELECT Id FROM patients)
""")
missing_patients = cursor.fetchone()[0]
print(f"Conditions with missing patient references: {missing_patients}")

#Checking if every encounter's PATIENT exists in the patients table
cursor.execute("""
    SELECT COUNT(*) FROM encounters
    WHERE PATIENT NOT IN (SELECT Id FROM patients)
""")
missing_encounter_patients = cursor.fetchone()[0]
print(f"Encounters with missing patient references: {missing_encounter_patients}")

#Checking if every condition's ENCOUNTER exists in the encounters table
cursor.execute("""
    SELECT COUNT(*) FROM conditions
    WHERE ENCOUNTER NOT IN (SELECT Id FROM encounters)
""")
missing_condition_encounters = cursor.fetchone()[0]
print(f"Conditions with missing encounter references: {missing_condition_encounters}")

#Checking if every procedure's PATIENT exists in the patients table
cursor.execute("""
    SELECT COUNT(*) FROM procedures
    WHERE PATIENT NOT IN (SELECT Id FROM patients)
""")
missing_procedure_patients = cursor.fetchone()[0]
print(f"Procedures with missing patient references: {missing_procedure_patients}")

#Checking if every medication's PATIENT exists in the patients table
cursor.execute("""
    SELECT COUNT(*) FROM medications
    WHERE PATIENT NOT IN (SELECT Id FROM patients)
""")
missing_medication_patients = cursor.fetchone()[0]
print(f"Medications with missing patient references: {missing_medication_patients}")

#Checking if every observation's PATIENT exists in the patients table
cursor.execute("""
    SELECT COUNT(*) FROM observations
    WHERE PATIENT NOT IN (SELECT Id FROM patients)
""")
missing_observation_patients = cursor.fetchone()[0]
print(f"Observations with missing patient references: {missing_observation_patients}")

#Checking for duplicate patient IDs
cursor.execute("""
    SELECT Id, COUNT(*) FROM patients GROUP BY Id HAVING COUNT(*) > 1
""")
duplicate_patients = cursor.fetchall()
print(f"Duplicate patient records found: {len(duplicate_patients)}")

conn.close()
print("\n Data Integrity Check Completed!")

#Checking Field-level Intigrity.
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt

#Connecting to SQLite database
conn = sqlite3.connect("synthea_diabetes.db")

#Validate Age Distribution (patients Table)
df_patients = pd.read_sql("SELECT Id, BIRTHDATE FROM patients", conn)

#Convert BIRTHDATE to Age
df_patients["BIRTHDATE"] = pd.to_datetime(df_patients["BIRTHDATE"], errors="coerce")
df_patients["AGE"] = (pd.Timestamp.today() - df_patients["BIRTHDATE"]).dt.days // 365

# Checking for missing or unrealistic values
invalid_ages = df_patients[(df_patients["AGE"] < 0) | (df_patients["AGE"] > 100)]
print(f"Invalid Age Entries: {len(invalid_ages)}")
print(invalid_ages)

#Validating the Diabetes Diagnoses (`conditions` Table)**
df_conditions = pd.read_sql("SELECT PATIENT, CODE, DESCRIPTION FROM conditions", conn)

#Checking for missing values
missing_conditions = df_conditions[df_conditions["CODE"].isnull()]
print(f"Missing Diagnosis Codes: {len(missing_conditions)}")

# And alos Ensuring 'CODE' column is treated as string before using .str
df_conditions["CODE"] = df_conditions["CODE"].astype(str)  # Convert to string type

# Validating ICD-10 Codes
valid_codes = ["E10", "E11", "E13", "E66", "I10"]
df_conditions["VALID"] = df_conditions["CODE"].str[:3].isin(valid_codes)  # Now .str should work
invalid_diagnoses = df_conditions[~df_conditions["VALID"]]
print(f"Invalid Diagnosis Codes: {len(invalid_diagnoses)}")
print(invalid_diagnoses)

#Validate Medication Names (`medications` Table)**
df_medications = pd.read_sql("SELECT PATIENT, DESCRIPTION FROM medications", conn)


missing_medications = df_medications[df_medications["DESCRIPTION"].isnull()]
print(f"Missing Medication Descriptions: {len(missing_medications)}")

# Checking for diabetes-related medications
diabetes_meds = ["Metformin", "Insulin", "Glipizide", "Glyburide"]
df_medications["IS_DIABETES_MED"] = df_medications["DESCRIPTION"].str.contains("|".join(diabetes_meds), case=False, na=False)
missing_diabetes_meds = df_medications[~df_medications["IS_DIABETES_MED"]]
print(f" Patients without recorded diabetes medications: {len(missing_diabetes_meds)}")

#Validate Encounter Records (`encounters` Table)**
df_encounters = pd.read_sql("SELECT PATIENT, COUNT(*) AS Num_Encounters FROM encounters GROUP BY PATIENT", conn)

# Checking for missing patient IDs
missing_encounters = df_encounters[df_encounters["PATIENT"].isnull()]
print(f"Missing Patient IDs in Encounters: {len(missing_encounters)}")

# Checking for unreasonable encounter counts (>100 in a short period)
high_encounters = df_encounters[df_encounters["Num_Encounters"] > 100]
print(f"Patients with excessive hospital visits (>100): {len(high_encounters)}")
print(high_encounters)


conn.close()
