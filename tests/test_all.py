from databases import Database
import pytest
from fastapi.testclient import TestClient
from main import app
import models
import crud
import database
import os
import httpx
from sqlalchemy import create_engine
from fastapi import Depends, FastAPI
from sqlalchemy.orm import sessionmaker

# os.environ["ENV"] = "test"
TEST_DATABASE_URL = "postgresql://postgres:banana@localhost:5432/parkings"
test_database = Database(TEST_DATABASE_URL)


client = TestClient(app)

@pytest.fixture(scope="function", autouse=True)
async def override_dependencies():
    client.dependency_overrides[database.get_db] = get_test_db
    await test_database.connect()
    yield
    await test_database.disconnect()

async def get_test_db():
    async with test_database.transaction():
        yield test_database
def test_read_company_by_fastapi():
    company_id = "1"
    response = client.get(f"/companies/{company_id}/")
    assert response.status_code == 200

def test_read_company():
    company_id = "1"
    response = httpx.get(f"http://localhost:8000/companies/{company_id}/")
    assert response.status_code == 200

def test_read_parking():
    parking_id = "1"
    response = httpx.get(f"http://localhost:8000/parkings/{parking_id}/")
    assert response.status_code == 200

def test_read_cities():
    response = httpx.get(f"http://localhost:8000/cities/")
    assert response.status_code == 200

def test_read_parkings():
    response = httpx.get(f"http://localhost:8000/parkings/")
    assert response.status_code == 200

# def test_read_company(test_db):
#     company_id = "1"
#     response = client.get(f"/companies/{company_id}/")
#     assert response.status_code == 200


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

