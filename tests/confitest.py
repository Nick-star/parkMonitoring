import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest
import database

TEST_DATABASE_URL = "postgresql://postgres:banana@localhost:5432/test_parkings"

# Создание тестового движка и сессии
test_engine = create_engine(TEST_DATABASE_URL)
TestSessionLocal = sessionmaker(bind=test_engine)


# Фикстура для предоставления тестовой сессии
@pytest.fixture
def test_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
