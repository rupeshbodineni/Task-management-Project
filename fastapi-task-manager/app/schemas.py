from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"

class TaskStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    
    class Config:
        from_attributes = True

class UserListResponse(UserResponse):
    pass

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=500)
    status: TaskStatus = TaskStatus.PENDING
    
    @validator('title', 'description')
    def fields_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Field cannot be empty')
        return v.strip()

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    status: Optional[TaskStatus] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    status: TaskStatus
    user_id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ErrorResponse(BaseModel):
    detail: str
    status_code: int