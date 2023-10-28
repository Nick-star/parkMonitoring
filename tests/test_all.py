import pytest
from fastapi.testclient import TestClient
from main import app
import models
import crud
import database
import os

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest
import database

# os.environ["ENV"] = "test"
TEST_DATABASE_URL = "postgresql://postgres:banana@localhost:5432/test_parkings"
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine(TEST_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
@pytest.fixture(scope="module")
def test_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

client = TestClient(app)


def test_read_company(test_db):
    company_id = "1"
    response = client.get(f"/companies/{company_id}/")
    assert response.status_code == 200

#
# @pytest.mark.asyncio
# async def test_read_parking():
#     parking_id = "1"
#     response = client.get(f"/parkings/{parking_id}/")
#     assert response.status_code == 200
#
#
# @pytest.mark.asyncio
# async def test_read_cities():
#     response = client.get(f"/cities/")
#     assert response.status_code == 200
#
#
# @pytest.mark.asyncio
# async def test_read_parkings():
#     response = client.get(f"/parkings/")
#     assert response.status_code == 200
#
#
# @pytest.mark.asyncio
# async def test_read_parkings_by_city():
#     city_id = "1"
#     response = client.get(f"/parkings/city/{city_id}/")
#     assert response.status_code == 200

