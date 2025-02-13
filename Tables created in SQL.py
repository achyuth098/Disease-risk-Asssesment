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


