from sqlalchemy import Table, Column, Integer, String, Float, ForeignKey, Boolean, MetaData

metadata = MetaData()

companies = Table(
    "companies",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(255), index=True),
    Column("description", String)
)

parkings = Table(
    "parkings",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("company_id", Integer, ForeignKey("companies.id")),
    Column("name", String(255), index=True),
    Column("city_id", Integer, ForeignKey("cities.id")),
    Column("latitude", Float),
    Column("longitude", Float),
    Column("total_spaces", Integer),
    Column("free_spaces", Integer),
    Column("is_paid", Boolean),
    Column("price", Float),
    Column("address", String)
)

parking_images = Table(
    "parking_images",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("parking_id", Integer, ForeignKey("parkings.id")),
    Column("image", String)
)

company_users = Table(
    "company_users",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("email", String(255), unique=True, index=True),
    Column("hashed_password", String),
    Column("first_name", String(255)),
    Column("last_name", String(255)),
    Column("phone_number", String(255)),
    Column("is_admin", Boolean, default=False),
    Column("company_id", Integer, ForeignKey("companies.id")),
)

cities = Table(
    "cities",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(255), index=True)
)

contacts = Table(
    "contacts",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(255), index=True),
    Column("email", String(255), index=True),
    Column("message", String)
)
