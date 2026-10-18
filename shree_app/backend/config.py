import json
import os
import re
from typing import Union
from urllib.parse import urlparse, parse_qs
from pydantic import BaseModel, Field

CONFIG_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "config", "database.json")

def load_raw_config() -> dict:
    """Loads configuration directly from config/database.json."""
    if not os.path.exists(CONFIG_FILE_PATH):
        raise FileNotFoundError(f"Database configuration file not found at {CONFIG_FILE_PATH}")
    with open(CONFIG_FILE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def parse_jdbc_to_sqlalchemy(jdbc_url: str, user: str = "", password: str = "", ssl: Union[bool, str] = False) -> str:
    """
    Parses a JDBC URL (e.g., jdbc:postgresql://host:port/database)
    and converts it into an SQLAlchemy compatible PostgreSQL URL:
    postgresql+psycopg2://user:password@host:port/database
    """
    if not jdbc_url.startswith("jdbc:postgresql://"):
        raise ValueError("Invalid JDBC URL. Expected prefix 'jdbc:postgresql://'")

    # Strip 'jdbc:' prefix
    clean_url = jdbc_url.replace("jdbc:", "", 1)
    parsed = urlparse(clean_url)

    host = parsed.hostname or "localhost"
    port = parsed.port or 5432
    path = parsed.path.lstrip("/")
    database = path or "postgres"

    # Extract user & password from config or URL query parameters
    db_user = user or (parsed.username or "postgres")
    db_pass = password or (parsed.password or "")

    auth_str = f"{db_user}:{db_pass}@" if db_user else ""
    if db_pass:
        auth_str = f"{db_user}:{db_pass}@"
    elif db_user:
        auth_str = f"{db_user}@"

    is_ssl = (ssl is True) or (isinstance(ssl, str) and ssl.lower() in ["require", "true", "verify-ca", "verify-full"])
    ssl_param = "?sslmode=require" if is_ssl else ""
    return f"postgresql+psycopg2://{auth_str}{host}:{port}/{database}{ssl_param}"

class DatabaseSettings(BaseModel):
    jdbc_url: str
    user: str
    password: str
    driver: str
    ssl: Union[bool, str] = False
    sqlalchemy_url: str
    max_pool_size: int = 10
    connection_timeout_ms: int = 5000

class JWTSettings(BaseModel):
    secret: str
    algorithm: str = "HS256"
    expires_in: str = "24h"
    expire_minutes: int = 1440

class Settings(BaseModel):
    database: DatabaseSettings
    jwt: JWTSettings

def get_settings() -> Settings:
    data = load_raw_config()
    jdbc_data = data.get("jdbc", {})
    jwt_data = data.get("jwt", {})

    sqlalchemy_url = parse_jdbc_to_sqlalchemy(
        jdbc_url=jdbc_data.get("url", "jdbc:postgresql://localhost:5432/postgres"),
        user=jdbc_data.get("user", "postgres"),
        password=jdbc_data.get("password", ""),
        ssl=jdbc_data.get("ssl", False)
    )

    db_settings = DatabaseSettings(
        jdbc_url=jdbc_data.get("url", ""),
        user=jdbc_data.get("user", "postgres"),
        password=jdbc_data.get("password", ""),
        driver=jdbc_data.get("driver", "org.postgresql.Driver"),
        ssl=jdbc_data.get("ssl", False),
        sqlalchemy_url=sqlalchemy_url,
        max_pool_size=jdbc_data.get("maxPoolSize", 10),
        connection_timeout_ms=jdbc_data.get("connectionTimeoutMs", 5000),
    )

    jwt_settings = JWTSettings(
        secret=jwt_data.get("secret", "default_secret_key_needs_override"),
        algorithm=jwt_data.get("algorithm", "HS256"),
        expires_in=jwt_data.get("expiresIn", "24h"),
        expire_minutes=1440,
    )

    return Settings(database=db_settings, jwt=jwt_settings)

settings = get_settings()
