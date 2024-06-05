from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pyotp import TOTP
from twilio.rest import Client
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

app = FastAPI()


# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    # Add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
security = HTTPBasic()

# Twilio configuration
import os

# Twilio configuration
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER')

# JWT configuration
SECRET_KEY = "zac" #os.environ.get('SECRET_KEY')


ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# In-memory storage for user data (replace with a proper database in production)
users = {
    'user1': {
        'username': 'user1',
        'hashed_password': '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',  # password: secret
        'phone_number': '+1234567890',
        'otp_secret': 'user1_otp_secret'
    }
}

class OTPRequest(BaseModel):
    otp: str

class User(BaseModel):
    username: str
    password: str

def verify_password(plain_password, hashed_password):
    print(plain_password)
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(credentials: HTTPBasicCredentials = Depends(security)):
    username = credentials.username
    password = credentials.password
    user = users.get(username)
    if not user or not verify_password(password, user['hashed_password']):
        raise HTTPException(status_code=401, detail='Invalid username or password')
    return username

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post('/login')
def login(user: User):
    db_user = users.get(user.username)
    if not db_user or not verify_password(user.password, db_user['hashed_password']):
        raise HTTPException(status_code=401, detail='Invalid username or password')
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={'sub': user.username}, expires_delta=access_token_expires
    )
    return {'access_token': access_token, 'token_type': 'bearer'}

@app.post('/send_otp')
def send_otp(username: str = Depends(authenticate_user)):
    user = users[username]
    totp = TOTP(user['otp_secret'])
    otp = totp.now()
    
    # Send SMS using Twilio
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    message = client.messages.create(
        body=f"Your OTP is: {otp}",
        from_=TWILIO_PHONE_NUMBER,
        to=user['phone_number']
    )
    
    return {'detail': 'OTP sent successfully'}

@app.post('/verify_otp')
def verify_otp(otp_request: OTPRequest, username: str = Depends(authenticate_user)):
    user = users[username]
    totp = TOTP(user['otp_secret'])
    if not totp.verify(otp_request.otp):
        raise HTTPException(status_code=401, detail='Invalid OTP')
    return {'detail': 'OTP verified successfully'}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)