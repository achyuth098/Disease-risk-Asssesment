import pandas as pd

# Define file paths
file_paths = {
    "patients": "/content/patients.csv",
    "conditions": "/content/conditions.csv",
    "encounters": "/content/encounters.csv",
    "medications": "/content/medications.csv",
    "observations": "/content/observations.csv",
    "procedures": "/content/procedures.csv",
}

# Load CSV files
dataframes = {name: pd.read_csv(path) for name, path in file_paths.items()}

### **1. Checking for Missing Values**
for name, df in dataframes.items():
    print(f"Missing values in {name} dataset:")
    print(df.isnull().sum(), "\n")

### **2. Handling Missing Values**
# A. Fill missing STOP values in conditions & medications with "Ongoing"
dataframes["conditions"]["STOP"].fillna("Ongoing", inplace=True)
dataframes["medications"]["STOP"].fillna("Ongoing", inplace=True)

# B. Convert VALUE column in observations.csv to numeric (ignoring errors)
dataframes["observations"]["VALUE"] = pd.to_numeric(dataframes["observations"]["VALUE"], errors='coerce')

# C. Fill missing lab values in observations.csv with median
dataframes["observations"]["VALUE"].fillna(dataframes["observations"]["VALUE"].median(), inplace=True)

### **3. Save Cleaned Data**
for name, df in dataframes.items():
    cleaned_path = f"cleaned_{name}.csv"
    df.to_csv(cleaned_path, index=False)
    print(f"✅ Cleaned {name} dataset saved as {cleaned_path}")

print("🚀 Data Cleaning Complete! Ready for SQLite3 integration.")
