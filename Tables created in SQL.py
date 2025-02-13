import sqlite3
import pandas as pd

# Create a new SQLite database (or connect if it already exists)
conn = sqlite3.connect("synthea_diabetes.db")
cursor = conn.cursor()

### **1. Create Tables with Primary & Foreign Keys**

# Patients Table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        Id TEXT PRIMARY KEY,
        BIRTHDATE TEXT,  
        GENDER TEXT,
        RACE TEXT,
        ETHNICITY TEXT
    )
""")

# Encounters Table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS encounters (
        Id TEXT PRIMARY KEY,
        PATIENT TEXT,
        START TEXT,
        STOP TEXT,
        EncounterClass TEXT,
        Code TEXT,
        Description TEXT,
        FOREIGN KEY (PATIENT) REFERENCES patients(Id)
    )
""")

# Conditions Table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS conditions (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        PATIENT TEXT,
        ENCOUNTER TEXT,
        START TEXT,
        STOP TEXT,
        CODE TEXT,
        DESCRIPTION TEXT,
        FOREIGN KEY (PATIENT) REFERENCES patients(Id),
        FOREIGN KEY (ENCOUNTER) REFERENCES encounters(Id)
    )
""")

# Medications Table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS medications (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        PATIENT TEXT,
        ENCOUNTER TEXT,
        START TEXT,
        STOP TEXT,
        CODE TEXT,
        DESCRIPTION TEXT,
        FOREIGN KEY (PATIENT) REFERENCES patients(Id),
        FOREIGN KEY (ENCOUNTER) REFERENCES encounters(Id)
    )
""")

# Observations Table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS observations (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        PATIENT TEXT,
        ENCOUNTER TEXT,
        DATE TEXT,
        CODE TEXT,
        DESCRIPTION TEXT,
        VALUE TEXT,
        FOREIGN KEY (PATIENT) REFERENCES patients(Id),
        FOREIGN KEY (ENCOUNTER) REFERENCES encounters(Id)
    )
""")

# Procedures Table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS procedures (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        PATIENT TEXT,
        ENCOUNTER TEXT,
        START TEXT,
        STOP TEXT,
        CODE TEXT,
        DESCRIPTION TEXT,
        FOREIGN KEY (PATIENT) REFERENCES patients(Id),
        FOREIGN KEY (ENCOUNTER) REFERENCES encounters(Id)
    )
""")

conn.commit()
print("✅ Tables created successfully in SQLite!")

 #Data loaded successfully into SQLite
import pandas as pd
import sqlite3

# Connect to SQLite database
conn = sqlite3.connect("synthea_diabetes.db")
cursor = conn.cursor()

# Define paths to cleaned CSV files
file_paths = {
    "patients": "cleaned_patients.csv",
    "conditions": "cleaned_conditions.csv",
    "encounters": "cleaned_encounters.csv",
    "medications": "cleaned_medications.csv",
    "observations": "cleaned_observations.csv",
    "procedures": "cleaned_procedures.csv"
}

# Define required columns for each table (prevent unnecessary columns from being inserted)
columns_to_keep = {
    "patients": ["Id", "BIRTHDATE", "GENDER", "RACE", "ETHNICITY"],
    "conditions": ["PATIENT", "ENCOUNTER", "START", "STOP", "CODE", "DESCRIPTION"],
    "encounters": ["Id", "PATIENT", "START", "STOP", "EncounterClass", "Code", "Description"],
    "medications": ["PATIENT", "ENCOUNTER", "START", "STOP", "CODE", "DESCRIPTION"],
    "observations": ["PATIENT", "ENCOUNTER", "DATE", "CODE", "DESCRIPTION", "VALUE"],
    "procedures": ["PATIENT", "ENCOUNTER", "START", "STOP", "CODE", "DESCRIPTION"]
}

# Insert data into each table
for table, path in file_paths.items():
    df = pd.read_csv(path)

    # Ensure only existing columns are selected
    available_columns = [col for col in columns_to_keep[table] if col in df.columns]
    df = df[available_columns]  # Only keep columns that exist in the CSV

    # Remove duplicates based on primary key
    if table == "patients":
        df.drop_duplicates(subset=["Id"], keep="first", inplace=True)
    elif table == "encounters":
        df.drop_duplicates(subset=["Id"], keep="first", inplace=True)

    # Insert into SQLite
    df.to_sql(table, conn, if_exists="replace", index=False)

    print(f"✅ Data inserted successfully into {table} table!")

conn.commit()
conn.close()

print("🚀 All data loaded successfully into SQLite without errors!")

