import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "app.db")

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Columns to add
    new_columns = [
        ("weaknesses", "TEXT"),
        ("matching_skills", "TEXT"),
        ("missing_skills", "TEXT"),
        ("upskilling_resources", "TEXT")
    ]
    
    for col_name, col_type in new_columns:
        try:
            cursor.execute(f"ALTER TABLE analyses ADD COLUMN {col_name} {col_type}")
            print(f"Added column {col_name} successfully.")
        except sqlite3.OperationalError as e:
            # Column might already exist
            print(f"Column {col_name} already exists or error occurred: {e}")
            
    conn.commit()
    conn.close()
else:
    print("Database file not found, it will be initialized on next startup.")
