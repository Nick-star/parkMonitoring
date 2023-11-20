from databases import Database

from models import CompanyCreate, ContactCreate, ParkingCreate, CompanyUserCreate, CompanyUser, CompanyUserBase, Parking, \
    CompanyUserUpdate
from tables import companies, parkings, parking_images, company_users, cities, contacts


async def create_company(db: Database, company: CompanyCreate):
    query = companies.insert().values(name=company.name, description=company.description)
    return await db.execute(query=query)


async def get_company(db: Database, company_id: int):
    query = companies.select().where(companies.c.id == company_id)
    return await db.fetch_one(query=query)


async def create_parking(db: Database, parking: ParkingCreate):
    query = parkings.insert().values(
        company_id=parking.company_id,
        name=parking.name,
        city=parking.city,
        latitude=parking.latitude,
        longitude=parking.longitude,
        total_spaces=parking.total_spaces,
        free_spaces=parking.free_spaces,
        is_paid=parking.is_paid,
        price=parking.price,
        address=parking.address
    )
    return await db.execute(query=query)


async def get_parking(db: Database, parking_id: int):
    query = parkings.select().where(parkings.c.id == parking_id)
    return await db.fetch_one(query=query)


async def get_parkings_by_city(db: Database, city_id: int):
    query = parkings.select().where(parkings.c.city_id == city_id)
    return await db.fetch_all(query=query)


async def get_parkings(db: Database):
    query = parkings.select()
    return await db.fetch_all(query=query)


async def create_parking_image(db: Database, parking_id: int, file_location: str):
    query = parking_images.insert().values(parking_id=parking_id, image=file_location)
    return await db.execute(query=query)


async def get_parking_images(db: Database, parking_id: int):
    query = parking_images.select().where(parking_images.c.parking_id == parking_id)
    return await db.fetch_all(query=query)


async def create_company_user(db: Database, company_user: CompanyUserCreate):
    query = company_users.insert().values(
        user_id=company_user.user_id,
        company_id=company_user.company_id,
        is_admin=company_user.is_admin
    )
    return await db.execute(query=query)


async def get_company_users(db: Database, company_id: int):
    query = company_users.select().where(company_users.c.company_id == company_id)
    return await db.fetch_all(query=query)


async def get_cities(db: Database):
    query = cities.select()
    return await db.fetch_all(query=query)


async def get_company_by_parking(db: Database, parking_id: int):
    query = parkings.select().where(parkings.c.id == parking_id)
    parking = await db.fetch_one(query=query)
    query = companies.select().where(companies.c.id == parking['company_id'])
    return await db.fetch_one(query=query)


async def post_contact(db: Database, contact: ContactCreate):
    query = contacts.insert().values(
        name=contact.name,
        email=contact.email,
        message=contact.message
    )
    return await db.execute(query=query)


async def get_user_by_email(db: Database, email: str):
    query = company_users.select().where(company_users.c.email == email)
    return await db.fetch_one(query=query)


async def get_user(db: Database, user_id: int):
    query = company_users.select().where(company_users.c.id == user_id)
    return await db.fetch_one(query=query)

async def update_user(db: Database, user: CompanyUser):
    query = company_users.update().where(company_users.c.id == user.id).values(
        hashed_password=user.hashed_password
    )
    await db.execute(query=query)

async def create_user(db: Database, user: CompanyUserBase, hashed_password: str):
    query = company_users.insert().values(
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        is_admin=user.is_admin,
        company_id=user.company_id
    )
    user_id = await db.execute(query=query)
    return {**user.dict(), "id": user_id}

async def get_parkings_by_company_and_city(db: Database, company_id: int, city_id: int):
    query = parkings.select().where(parkings.c.company_id == company_id).where(parkings.c.city_id == city_id)
    return await db.fetch_all(query=query)

async def update_parking(db: Database, parking: Parking):
    query = parkings.update().where(parkings.c.id == parking.id).values(
        free_spaces=parking.free_spaces
    )
    await db.execute(query=query)