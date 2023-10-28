from sqlalchemy import create_engine
from databases import Database
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("ENV")

if ENV == "test":
    DB_USERNAME = os.getenv("DB_TEST_USERNAME")
    DB_PASSWORD = os.getenv("DB_TEST_PASSWORD")
    DB_HOST = os.getenv("DB_TEST_HOST")
    DB_PORT = os.getenv("DB_TEST_PORT")
    DB_NAME = os.getenv("DB_TEST_NAME")
else:
    DB_USERNAME = os.getenv("DB_USERNAME")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


engine = create_engine(DATABASE_URL)
database = Database(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()