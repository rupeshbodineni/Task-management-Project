from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models import User, Task
from app.schemas import (
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskStatus,
    UserRole,
)
from app.auth import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/")
def root():
    return {"message": "Welcome to Task Manager API", "version": "1.0.0", "docs": "/docs"}


@app.post("/api/v1/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=UserRole.USER,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"id": new_user.id, "role": new_user.role})
    return {"access_token": token, "token_type": "bearer", "user": UserResponse.from_orm(new_user)}


@app.post("/api/v1/auth/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token({"id": db_user.id, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer", "user": UserResponse.from_orm(db_user)}


@app.get("/api/v1/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.from_orm(current_user)


@app.post("/api/v1/tasks/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        user_id=current_user.id,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return TaskResponse.from_orm(db_task)


@app.get("/api/v1/tasks/", response_model=list[TaskResponse])
def get_tasks(status: TaskStatus | None = Query(None), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Task).filter(Task.user_id == current_user.id)
    if status:
        query = query.filter(Task.status == status)
    tasks = query.all()
    return [TaskResponse.from_orm(task) for task in tasks]


@app.get("/api/v1/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return TaskResponse.from_orm(task)


@app.put("/api/v1/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.status is not None:
        task.status = task_update.status

    db.commit()
    db.refresh(task)
    return TaskResponse.from_orm(task)


@app.delete("/api/v1/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    db.delete(task)
    db.commit()
    return None
