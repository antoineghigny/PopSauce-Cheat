import os
from dataclasses import dataclass
from pathlib import Path

@dataclass
class Config:
    DATABASE_NAME: str = os.getenv('DATABASE_NAME', 'popsauce.db')
    DATABASE_PATH: Path = Path(os.getenv('DATABASE_PATH', Path.cwd()))