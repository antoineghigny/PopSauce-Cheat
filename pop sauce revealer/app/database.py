import sqlite3
from pathlib import Path
from app.config import Config

class DatabaseConnection:
    def __init__(self, db_path: Path):
        self.db_path = db_path

    def __enter__(self):
        self.connection = sqlite3.connect(self.db_path)
        return self.connection.cursor()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.connection.commit()
        self.connection.close()

class DatabaseOperations:
    def __init__(self, config: Config):
        self.config = config

    def create_table(self):
        with DatabaseConnection(self.config.DATABASE_PATH / self.config.DATABASE_NAME) as cursor:
            cursor.execute('''CREATE TABLE IF NOT EXISTS data (
                              key TEXT PRIMARY KEY,
                              value TEXT
                              )''')

    def insert_data(self, key: str, value: str):
        with DatabaseConnection(self.config.DATABASE_PATH / self.config.DATABASE_NAME) as cursor:
            cursor.execute("INSERT OR REPLACE INTO data (key, value) VALUES (?, ?)", (key, value))

    def key_exists(self, key: str) -> bool:
        with DatabaseConnection(self.config.DATABASE_PATH / self.config.DATABASE_NAME) as cursor:
            cursor.execute("SELECT key FROM data WHERE key=?", (key,))
            return cursor.fetchone() is not None

    def get_value_by_key(self, key: str):
        with DatabaseConnection(self.config.DATABASE_PATH / self.config.DATABASE_NAME) as cursor:
            return cursor.execute("SELECT value FROM data WHERE key=?", (key,)).fetchone()
