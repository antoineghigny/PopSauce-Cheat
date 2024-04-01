from app.database import DatabaseOperations

class DataService:
    def __init__(self, db_ops: DatabaseOperations):
        self.db_ops = db_ops

    def add_data(self, key: str, value: str) -> bool:
        if not self.db_ops.key_exists(key):
            self.db_ops.insert_data(key, value)
            return True
        return False

    def retrieve_data(self, key: str):
        return self.db_ops.get_value_by_key(key)