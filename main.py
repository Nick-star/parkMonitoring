from typing import List

from fastapi import FastAPI, UploadFile, File, Request, Response, status, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from fastapi.staticfiles import StaticFiles
from passlib.context import CryptContext
import crud
import database
import models
from auth import verify_password, cookie_serializer
from config import CORS_CONFIG

app = FastAPI()

security = HTTPBasic()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token/")


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)
    try:
        request.state.db = database.SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response


app.mount("/images", StaticFiles(directory="images", html=True), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_CONFIG["allow_origins"],
    allow_credentials=CORS_CONFIG["allow_credentials"],
    allow_methods=CORS_CONFIG["allow_methods"],
    allow_headers=CORS_CONFIG["allow_headers"],
)


@app.on_event("startup")
async def startup():
    await database.database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.database.disconnect()


@app.post("/companies/", response_model=models.Company)
async def create_company(company: models.CompanyCreate):
    return await crud.create_company(database.database, company)


@app.get("/companies/{company_id}/", response_model=models.Company)
async def read_company(company_id: int):
    return await crud.get_company(database.database, company_id)


@app.post("/companies/{company_id}/parkings/", response_model=models.Parking)
async def create_parking_for_company(company_id: int, parking: models.ParkingCreate):
    return await crud.create_parking(database.database, parking)


@app.get("/parkings/{parking_id}/", response_model=models.Parking)
async def read_parking(parking_id: int):
    return await crud.get_parking(database.database, parking_id)


@app.get("/parkings/city/{city_id}/", response_model=List[models.Parking])
async def read_parkings_by_city(city_id: int):
    return await crud.get_parkings_by_city(database.database, city_id)


@app.get("/cities/", response_model=List[models.City])
async def read_cities():
    return await crud.get_cities(database.database)


@app.get("/parkings/", response_model=List[models.Parking])
async def read_parkings():
    return await crud.get_parkings(database.database)


@app.post("/parkings/{parking_id}/images/")
async def create_parking_image(parking_id: int, image: UploadFile = File(...)):
    # Определение пути для сохранения файла
    file_location = f"images/{image.filename}"

    # Сохранение файла на диск
    with open(file_location, "wb+") as file_object:
        file_object.write(image.file.read())

    # Сохранение пути к файлу в базе данных
    return await crud.create_parking_image(database.database, parking_id, file_location)


@app.get("/parkings/{parking_id}/images/")
async def get_images(parking_id: int):
    return await crud.get_parking_images(database.database, parking_id)

@app.get("/companies/{company_id}/parkings/city/{city_id}/")
async def get_parkings_by_company_and_city(company_id: int, city_id: int):
    return await crud.get_parkings_by_company_and_city(database.database, company_id, city_id)


@app.get("/parkings/{parking_id}/company/")
async def get_company_by_parking(parking_id: int):
    return await crud.get_company_by_parking(database.database, parking_id)


@app.post("/contacts/", response_model=int)
async def create_contact(contact: models.ContactCreate):
    return await crud.post_contact(database.database, contact)


@app.post("/token/")
async def login(credentials: HTTPBasicCredentials = Depends(security)):
    user = await crud.get_user_by_email(database.database, credentials.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Basic"},
        )
    print(user.hashed_password)
    print(credentials.password)
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Basic"},
        )
    token = cookie_serializer.dumps(credentials.username)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/users/me/")
async def read_users_me(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token/"))):
    username = cookie_serializer.loads(token)
    user = await crud.get_user_by_email(database.database, username)
    return user

@app.put("/users/me/")
async def update_user(user_update: models.CompanyUserUpdate, token: str = Depends(oauth2_scheme)):
    username = cookie_serializer.loads(token)
    user = await crud.get_user_by_email(database.database, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")


    if user_update.password:
        hashed_password = pwd_context.hash(user_update.password)
        user.hashed_password = hashed_password

    await crud.update_user(database.database, user)
    return {"detail": "User updated successfully"}


@app.post("/users/", response_model=models.CompanyUser)
async def create_user(user: models.CompanyUserCreate):
    hashed_password = pwd_context.hash(user.password)
    user_create = models.CompanyUserBase(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        is_admin=user.is_admin,
        company_id=user.company_id
    )
    return await crud.create_user(database.database, user_create, hashed_password)

@app.put("/parkings/{parking_id}/increase")
async def increase_free_spaces(parking_id: int):
    parking = await crud.get_parking(database.database, parking_id)
    if not parking:
        raise HTTPException(status_code=404, detail="Parking not found")
    if parking.free_spaces >= parking.total_spaces:
        raise HTTPException(status_code=400, detail="No more spaces available to increase")
    parking.free_spaces += 1
    await crud.update_parking(database.database, parking)
    return {"detail": "Increased free spaces successfully"}

@app.put("/parkings/{parking_id}/decrease")
async def decrease_free_spaces(parking_id: int):
    parking = await crud.get_parking(database.database, parking_id)
    if not parking:
        raise HTTPException(status_code=404, detail="Parking not found")
    if parking.free_spaces <= 0:
        raise HTTPException(status_code=400, detail="No more spaces available to decrease")
    parking.free_spaces -= 1
    await crud.update_parking(database.database, parking)
    return {"detail": "Decreased free spaces successfully"}