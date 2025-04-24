# import pandas as pd
# import sqlite3
# from datetime import datetime

# # Current date (as per system info)
# CURRENT_DATE = datetime(2025, 3, 14)

# # Step 1: Create SQLite database
# conn = sqlite3.connect("synthea.db")
# cursor = conn.cursor()

# # Step 2: Create Tables with Primary & Foreign Keys (using Synthea names)
# cursor.execute("""
#     CREATE TABLE IF NOT EXISTS patients (
#         Id TEXT PRIMARY KEY,
#         AGE INTEGER,
#         GENDER TEXT,
#         RACE TEXT,
#         ETHNICITY TEXT
#     )
# """)

# cursor.execute("""
#     CREATE TABLE IF NOT EXISTS encounters (
#         Id TEXT PRIMARY KEY,
#         PATIENT TEXT,
#         START TEXT,
#         STOP TEXT,
#         CODE INTEGER,
#         DESCRIPTION TEXT,
#         REASONCODE INTEGER,
#         REASONDESCRIPTION TEXT,
#         ENCOUNTERCLASS TEXT,
#         FOREIGN KEY (PATIENT) REFERENCES patients(Id)
#     )
# """)

# cursor.execute("""
#     CREATE TABLE IF NOT EXISTS conditions (
#         START TEXT,
#         STOP TEXT,
#         PATIENT TEXT,
#         ENCOUNTER TEXT,
#         CODE INTEGER,
#         DESCRIPTION TEXT,
#         FOREIGN KEY (PATIENT) REFERENCES patients(Id),
#         FOREIGN KEY (ENCOUNTER) REFERENCES encounters(Id)
#     )
# """)

# cursor.execute("""
#     CREATE TABLE IF NOT EXISTS observations (
#         PATIENT TEXT,
#         ENCOUNTER TEXT,
#         DATE TEXT,
#         CODE TEXT,
#         DESCRIPTION TEXT,
#         VALUE TEXT,
#         UNITS TEXT,
#         FOREIGN KEY (PATIENT) REFERENCES patients(Id),
#         FOREIGN KEY (ENCOUNTER) REFERENCES encounters(Id)
#     )
# """)

# cursor.execute("""
#     CREATE TABLE IF NOT EXISTS procedures (
#         PATIENT TEXT,
#         ENCOUNTER TEXT,
#         START TEXT,
#         STOP TEXT,
#         DESCRIPTION TEXT,
#         REASONCODE INTEGER,
#         REASONDESCRIPTION TEXT,
#         FOREIGN KEY (PATIENT) REFERENCES patients(Id),
#         FOREIGN KEY (ENCOUNTER) REFERENCES encounters(Id)
#     )
# """)

# cursor.execute("""
#     CREATE TABLE IF NOT EXISTS medications (
#         PATIENT TEXT,
#         ENCOUNTER TEXT,
#         START TEXT,
#         STOP TEXT,
#         CODE INTEGER,
#         DESCRIPTION TEXT,
#         REASONCODE INTEGER,
#         REASONDESCRIPTION TEXT,
#         DISPENSES INTEGER,
#         FOREIGN KEY (PATIENT) REFERENCES patients(Id),
#         FOREIGN KEY (ENCOUNTER) REFERENCES encounters(Id)
#     )
# """)

# conn.commit()
# print("✅ Tables created successfully in SQLite!")

# # Step 3: Load CSV files and prepare data
# patients = pd.read_csv('patients.csv')
# encounters = pd.read_csv('encounters.csv')
# conditions = pd.read_csv('conditions.csv')
# procedures = pd.read_csv('procedures.csv')
# medications = pd.read_csv('medications.csv')

# # Step 4: Calculate Age in patients.csv (pre-load)
# patients['BIRTHDATE'] = pd.to_datetime(patients['BIRTHDATE'], errors='coerce')
# patients['AGE'] = patients['BIRTHDATE'].apply(
#     lambda x: CURRENT_DATE.year - x.year - ((CURRENT_DATE.month, CURRENT_DATE.day) < (x.month, x.day))
#     if pd.notna(x) else None
# )

# # Step 5: Select columns and load into SQLite
# columns_to_keep = {
#     "patients": ["Id", "AGE", "GENDER", "RACE", "ETHNICITY"],
#     "encounters": ["Id", "PATIENT", "START", "STOP", "CODE", "DESCRIPTION", "REASONCODE", "REASONDESCRIPTION", "ENCOUNTERCLASS"],
#     "conditions": ["START", "STOP", "PATIENT", "ENCOUNTER", "CODE", "DESCRIPTION"],
#     "observations": ["PATIENT", "ENCOUNTER", "DATE", "CODE", "DESCRIPTION", "VALUE", "UNITS"],
#     "procedures": ["PATIENT", "ENCOUNTER", "START", "STOP", "DESCRIPTION", "REASONCODE", "REASONDESCRIPTION"],
#     "medications": ["PATIENT", "ENCOUNTER", "START", "STOP", "CODE", "DESCRIPTION", "REASONCODE", "REASONDESCRIPTION", "DISPENSES"]
# }

# # Load all tables except observations
# for table in ["patients", "encounters", "conditions", "procedures", "medications"]:
#     df = globals()[table]
#     available_cols = [col for col in columns_to_keep[table] if col in df.columns]
#     df = df[available_cols]
#     df.to_sql(table, conn, if_exists="replace", index=False)
#     print(f"✅ Data inserted successfully into {table} table!")

# # Load observations.csv in chunks
# chunksize = 100000
# obs_cols = columns_to_keep["observations"]
# dtypes = {
#     "PATIENT": str,
#     "ENCOUNTER": str,
#     "DATE": str,
#     "CODE": str,
#     "DESCRIPTION": str,
#     "VALUE": str,
#     "UNITS": str
# }

# first_chunk = True
# for chunk in pd.read_csv('observations.csv', chunksize=chunksize, usecols=obs_cols, dtype=dtypes):
#     available_cols = [col for col in obs_cols if col in chunk.columns]
#     chunk = chunk[available_cols]
#     if first_chunk:
#         chunk.to_sql('observations', conn, if_exists="replace", index=False)
#         first_chunk = False
#     else:
#         chunk.to_sql('observations', conn, if_exists="append", index=False)
#     print(f"✅ Inserted chunk of {len(chunk)} rows into observations table!")

# # Step 6: Integrity Check in SQLite
# def check_integrity_sql():
#     print("Starting SQLite integrity checks...")
#     for table in ['encounters', 'conditions', 'observations', 'procedures', 'medications']:
#         cursor.execute(f"""
#             SELECT COUNT(DISTINCT {table}.PATIENT) 
#             FROM {table} 
#             WHERE {table}.PATIENT NOT IN (SELECT Id FROM patients)
#         """)
#         invalId_count = cursor.fetchone()[0]
#         if invalId_count > 0:
#             print(f"WARNING: {table} has {invalId_count} PATIENT Ids not in patients")
#         else:
#             print(f"{table} PATIENT Ids all valId")

#     for table in ['conditions', 'observations', 'procedures', 'medications']:
#         cursor.execute(f"""
#             SELECT COUNT(DISTINCT {table}.ENCOUNTER) 
#             FROM {table} 
#             WHERE {table}.ENCOUNTER NOT IN (SELECT Id FROM encounters)
#         """)
#         invalId_count = cursor.fetchone()[0]
#         if invalId_count > 0:
#             print(f"WARNING: {table} has {invalId_count} ENCOUNTER Ids not in encounters")
#         else:
#             print(f"{table} ENCOUNTER Ids all valId")

# check_integrity_sql()

# # Step 7: Merge tables using SQL with aliases
# query = """
#     SELECT 
#         p.Id, p.AGE, p.GENDER, p.RACE, p.ETHNICITY,
#         e.Id AS ENCOUNTER_Id, 
#         e.START AS ENC_START, 
#         e.STOP AS ENC_STOP, 
#         e.CODE AS ENC_CODE, 
#         e.DESCRIPTION AS ENC_DESC, 
#         e.REASONCODE AS ENC_REASON_CODE, 
#         e.REASONDESCRIPTION AS ENC_REASON_DESC, 
#         e.ENCOUNTERCLASS,
#         c.START AS COND_START, 
#         c.STOP AS COND_STOP, 
#         c.CODE AS COND_CODE, 
#         c.DESCRIPTION AS COND_DESC,
#         o.DATE AS OBS_DATE, 
#         o.CODE AS OBS_CODE, 
#         o.VALUE AS OBS_VALUE, 
#         o.UNITS,
#         o.DESCRIPTION AS OBS_DESC,
#         pr.START AS PROC_START, 
#         pr.STOP AS PROC_STOP, 
#         pr.DESCRIPTION AS PROC_DESC,
#         pr.REASONCODE AS PROC_REASON_CODE, 
#         pr.REASONDESCRIPTION AS PROC_REASON_DESC,
#         m.START AS MED_START, 
#         m.STOP AS MED_STOP, 
#         m.CODE AS MED_CODE, 
#         m.DESCRIPTION AS MED_DESC,
#         m.REASONCODE AS MED_REASON_CODE, 
#         m.REASONDESCRIPTION AS MED_REASON_DESC, 
#         m.DISPENSES AS MED_DISPENSES
#     FROM patients p
#     LEFT JOIN encounters e ON p.Id = e.PATIENT
#     LEFT JOIN conditions c ON e.PATIENT = c.PATIENT AND e.Id = c.ENCOUNTER
#     LEFT JOIN observations o ON e.PATIENT = o.PATIENT AND e.Id = o.ENCOUNTER
#     LEFT JOIN procedures pr ON e.PATIENT = pr.PATIENT AND e.Id = pr.ENCOUNTER
#     LEFT JOIN medications m ON e.PATIENT = m.PATIENT AND e.Id = m.ENCOUNTER
# """

# # Execute query and load result into pandas
# merged_df = pd.read_sql_query(query, conn)
# print("Merged DataFrame shape:", merged_df.shape)
# print(merged_df.head())

# # Save to CSV
# merged_df.to_csv('merged_diabetes_data.csv', index=False)

# # Close connection
# conn.close()
# print("✅ SQLite connection closed!")







import sqlite3

# Connect to existing SQLite database
conn = sqlite3.connect("synthea.db")
cursor = conn.cursor()

# List of tables to inspect
tables = ["patients", "encounters", "conditions", "observations", "procedures", "medications"]

# Get column names for each table
for table in tables:
    print(f"\nColumn names in {table} table:")
    cursor.execute(f"PRAGMA table_info({table})")
    columns = cursor.fetchall()
    for column in columns:
        print(f"Name: {column[1]}, Type: {column[2]}")

# Close connection
conn.close()
print("\n✅ SQLite connection closed!")