# Task Manager API - Scalable Backend with Authentication & Role-Based Access

A production-ready REST API built with FastAPI featuring secure JWT authentication, role-based access control (RBAC), comprehensive CRUD operations, and a responsive React frontend. This project demonstrates scalable backend architecture with industry best practices.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Frontend Usage](#frontend-usage)
- [Scalability & Deployment](#scalability--deployment)
- [Contributing](#contributing)

---

## ✨ Features

### Backend
- ✅ **User Registration & Authentication** - Secure registration with email validation and password hashing using bcrypt
- ✅ **JWT Token Authentication** - Stateless authentication with token-based access control
- ✅ **Role-Based Access Control (RBAC)** - USER and ADMIN roles with permission management
- ✅ **CRUD Operations** - Full task management system with create, read, update, delete operations
- ✅ **Input Validation** - Comprehensive validation using Pydantic models
- ✅ **Error Handling** - Structured error responses with appropriate HTTP status codes
- ✅ **API Versioning** - RESTful API versioning (`/api/v1/`)
- ✅ **Auto-Generated Documentation** - Swagger UI and ReDoc documentation
- ✅ **CORS Support** - Cross-origin resource sharing enabled
- ✅ **Database** - SQLite for development, PostgreSQL-ready for production

### Frontend
- ✅ **Responsive Design** - Mobile-friendly React interface
- ✅ **Authentication UI** - Registration and login pages
- ✅ **Protected Dashboard** - JWT-based access control on frontend
- ✅ **Task Management** - Full CRUD with real-time feedback
- ✅ **Status Filtering** - Filter tasks by status (Pending, In Progress, Completed)
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Token Management** - Automatic token refresh and logout

### Security
- ✅ **Password Hashing** - bcrypt-based password hashing
- ✅ **JWT Encryption** - Secure token generation and validation
- ✅ **Input Sanitization** - Validation at both frontend and backend
- ✅ **HTTPS Ready** - Can be easily deployed with SSL/TLS
- ✅ **CORS Configuration** - Configurable for production environments

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python web framework)
- **Database**: SQLite (development), PostgreSQL (production-ready)
- **ORM**: SQLAlchemy
- **Authentication**: JWT (PyJWT), Bcrypt, python-jose
- **Validation**: Pydantic
- **API Documentation**: Swagger UI, ReDoc

### Frontend
- **Framework**: React 18
- **HTTP Client**: Axios
- **Styling**: CSS3
- **State Management**: React Hooks

### DevOps & Deployment
- **Containerization**: Docker (optional)
- **Web Server**: Uvicorn (ASGI)
- **Task Queue**: Celery (scalability feature)
- **Caching**: Redis (optional)

---

## 📁 Project Structure

```
fastapi-task-manager/
├── app/                                 # Backend application
│   ├── __init__.py
│   ├── main.py                         # FastAPI app initialization
│   ├── database.py                     # Database configuration
│   ├── models.py                       # SQLAlchemy models
│   ├── schemas.py                      # Pydantic schemas & validation
│   ├── auth.py                         # Authentication utilities
│   └── routes/
│       ├── __init__.py
│       ├── auth.py                     # Authentication routes
│       └── task.py                     # Task CRUD routes
│
├── frontend/                            # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js
│   │   ├── api.js                      # Axios client configuration
│   │   ├── App.js                      # Main React component
│   │   ├── App.css                     # Styles
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── requirements.txt                    # Python dependencies
├── README.md                           # This file
├── .env.example                        # Environment variables template
└── SCALABILITY.md                      # Scalability documentation

```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 14+ & npm
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fastapi-task-manager.git
   cd fastapi-task-manager
   ```

2. **Create Python virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server**
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Backend will be available at: `http://localhost:8000`

5. **Access API Documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   Frontend will be available at: `http://localhost:3000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <your_token>
```

#### List Users (Admin Only)
```http
GET /auth/users
Authorization: Bearer <admin_token>
```

### Task Endpoints

#### Create Task
```http
POST /tasks/
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the REST API",
  "status": "PENDING"
}
```

#### Get All Tasks
```http
GET /tasks/
Authorization: Bearer <your_token>

# Optional query parameters
GET /tasks/?status=PENDING
GET /tasks/?status=IN_PROGRESS
GET /tasks/?status=COMPLETED
```

#### Get Task by ID
```http
GET /tasks/{task_id}
Authorization: Bearer <your_token>
```

#### Update Task
```http
PUT /tasks/{task_id}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS"
}
```

#### Delete Task
```http
DELETE /tasks/{task_id}
Authorization: Bearer <your_token>
```

### Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created
- `204 No Content` - Deletion successful
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Invalid/missing token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description VARCHAR(500) NOT NULL,
  status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
  user_id INTEGER NOT NULL FOREIGN KEY REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Relationships
- **One-to-Many**: One user can have many tasks
- **Cascade Delete**: Deleting a user deletes their tasks

---

## 🔒 Security Features

### Password Security
- **Bcrypt Hashing**: Passwords are hashed using bcrypt with salt
- **Minimum Length**: Password must be at least 6 characters
- **No Plaintext Storage**: Passwords are never stored in plaintext

### JWT Authentication
- **Token-Based**: Stateless authentication using JWT tokens
- **Expiration**: Tokens can be configured with expiration times
- **Secret Key**: Uses environment variable for secret key
- **Algorithm**: HS256 encryption algorithm

### Authorization
- **Role-Based Access Control**: Different permissions for USER and ADMIN roles
- **User Isolation**: Users can only access their own tasks
- **Admin Functions**: Admin-only endpoints for user management

### Input Validation
- **Email Validation**: Email format validation using Pydantic
- **String Length**: Title and description have maximum lengths
- **Enum Validation**: Status must be one of predefined values
- **Type Validation**: All inputs are type-checked

### CORS Security
- **Configurable Origins**: CORS can be restricted to specific domains
- **Credentials**: Can be configured for credential sharing
- **Method Restrictions**: Can restrict to specific HTTP methods

---

## 💻 Frontend Usage

### Running the Frontend
```bash
cd frontend
npm start
```

### Features

1. **Authentication**
   - Register new account
   - Login with email/password
   - Auto-logout on token expiration

2. **Task Management**
   - Create new tasks
   - Edit existing tasks
   - Delete tasks
   - View all tasks with status

3. **Filtering**
   - Filter by status (All, Pending, In Progress, Completed)
   - Real-time task updates

4. **Error Handling**
   - User-friendly error messages
   - Success notifications
   - Validation feedback

---

## 🚀 Scalability & Deployment

### Scalability Features

1. **Microservices Ready**
   - Separated auth and task modules
   - Independent scaling capabilities
   - API versioning for backward compatibility

2. **Caching Strategy**
   - Redis integration ready
   - Task result caching
   - User session caching

3. **Database Optimization**
   - SQLAlchemy ORM for query optimization
   - Database indexing on frequently queried fields
   - Connection pooling

4. **Async Operations**
   - FastAPI supports async/await
   - Background tasks capability
   - Real-time WebSocket support available

5. **Load Balancing**
   - Stateless API design
   - Horizontal scaling ready
   - Session-independent authentication

### Production Deployment

See [SCALABILITY.md](./SCALABILITY.md) for detailed deployment strategies including:
- Docker containerization
- Kubernetes orchestration
- Load balancing configuration
- Database migration strategies
- Monitoring and logging setup
- CI/CD pipeline configuration

### Deployment Quick Start

1. **Using Docker**
   ```bash
   docker build -t task-manager-api .
   docker run -p 8000:8000 task-manager-api
   ```

2. **Using Heroku**
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

3. **Using AWS/GCP/Azure**
   - Configure environment variables
   - Setup database connection strings
   - Deploy using respective cloud CLI

---

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=sqlite:///./taskdb.db
# For PostgreSQL: postgresql://user:password@localhost/dbname

# JWT
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# Environment
DEBUG=True  # Set to False in production
```

---

## 🧪 Testing

### Backend API Testing with curl

```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create Task
curl -X POST http://localhost:8000/api/v1/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"This is a test","status":"PENDING"}'
```

### Frontend Testing
- Use Swagger UI: http://localhost:8000/docs
- Use Postman: Import the provided collection
- Use React frontend: http://localhost:3000

---

## 📦 Dependencies

### Backend
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic[email]==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

### Frontend
```
react==18.2.0
react-dom==18.2.0
axios==1.4.0
react-scripts==5.0.1
```

---

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Backend (change port)
   python -m uvicorn app.main:app --port 8001
   
   # Frontend (change port)
   PORT=3001 npm start
   ```

2. **CORS errors**
   - Ensure frontend URL is in ALLOWED_ORIGINS
   - Check backend CORS middleware configuration

3. **Token expiration**
   - Re-login to get new token
   - Implement token refresh endpoint

4. **Database errors**
   - Check DATABASE_URL is correct
   - Ensure database permissions
   - Run migrations if needed

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API documentation at `/docs`

---

## 🎯 Next Steps

1. **Testing**: Add unit and integration tests
2. **Monitoring**: Implement logging and monitoring
3. **Documentation**: Create Postman collection
4. **Performance**: Add caching with Redis
5. **Features**: Implement task sharing and collaboration

---

**Made with ❤️ for the Primetrade.ai Hiring Challenge**

