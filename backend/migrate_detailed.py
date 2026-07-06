import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "app.db")

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE analyses ADD COLUMN detailed_review TEXT")
        print("Added column detailed_review successfully.")
    except sqlite3.OperationalError as e:
        print(f"Column detailed_review already exists or error occurred: {e}")
            
    conn.commit()
    conn.close()
else:
    print("Database file not found.")
