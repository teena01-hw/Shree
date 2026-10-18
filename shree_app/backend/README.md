# Production FastAPI + PostgreSQL + SQLAlchemy Authentication Backend

This backend implements a production-grade authentication service using:
- **FastAPI**: Modern, high-performance web framework
- **PostgreSQL**: Robust relational database engine
- **SQLAlchemy 2.0**: Declarative ORM without SQLite fallback
- **Pydantic v2**: Strict input and output validation
- **JWT (JSON Web Tokens)**: Cryptographically signed tokens (HS256) for secure session management
- **Bcrypt**: Encrypted password storage with high-entropy salt rounds
- **JDBC Configuration**: Reads database connection parameters from `config/database.json`

## Setup & Running Locally

1. Create and activate a Python virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

3. Ensure PostgreSQL is running and update `config/database.json` with your JDBC connection URL:
```json
{
  "jdbc": {
    "url": "jdbc:postgresql://localhost:5432/your_database",
    "user": "postgres",
    "password": "your_secure_password"
  }
}
```

4. Start the FastAPI server with Uvicorn:
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.
