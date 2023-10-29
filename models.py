from typing import Optional

from pydantic import BaseModel


class CompanyBase(BaseModel):
    name: str
    description: str


class CompanyCreate(CompanyBase):
    pass


class Company(CompanyBase):
    id: int

    class Config:
        orm_mode = True


class ParkingBase(BaseModel):
    company_id: int
    name: str
    city_id: int
    latitude: float
    longitude: float
    total_spaces: int
    free_spaces: int
    is_paid: bool
    price: Optional[float] = None
    address: str


class ParkingCreate(ParkingBase):
    pass


class Parking(ParkingBase):
    id: int

    class Config:
        orm_mode = True


class ParkingImageBase(BaseModel):
    parking_id: int
    image: str


class ParkingImageCreate(ParkingImageBase):
    pass


class ParkingImage(ParkingImageBase):
    id: int

    class Config:
        orm_mode = True


class CompanyUserBase(BaseModel):
    email: str
    first_name: str
    last_name: str
    phone_number: str
    is_admin: bool
    company_id: int


class CompanyUserCreate(CompanyUserBase):
    password: str


class CompanyUser(CompanyUserBase):
    id: int

    class Config:
        orm_mode = True


class CityBase(BaseModel):
    name: str


class CityCreate(CityBase):
    pass


class City(CityBase):
    id: int

    class Config:
        orm_mode = True


class ContactBase(BaseModel):
    name: str
    email: str
    message: str


class ContactCreate(ContactBase):
    pass


class Contact(ContactBase):
    id: int

    class Config:
        orm_mode = True
