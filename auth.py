from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from itsdangerous import URLSafeTimedSerializer, BadData
from passlib.context import CryptContext

from crud import get_user_by_email
from database import get_db

# Секретный ключ для создания и проверки подписанных cookie
SECRET_KEY = "your_secret_key"
# Создаем инстанс для работы с паролями
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Создаем инстанс для безопасного хранения данных в cookies
cookie_serializer = URLSafeTimedSerializer(SECRET_KEY)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_current_user(authorization: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    try:
        email = cookie_serializer.loads(authorization.credentials, max_age=3600)  # действителен в течение 1 часа
    except BadData:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db = get_db()
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
