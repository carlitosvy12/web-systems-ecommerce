import os
from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

BASE_DIR = Path(__file__).resolve().parent

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Postgres (Supabase)
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
else:
    # SQLite local (para desarrollo)
    sqlite_file_path = BASE_DIR / "database.db"
    sqlite_url = f"sqlite:///{sqlite_file_path}"
    connect_args = {"check_same_thread": False}
    engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables() -> None:
    from app.models import user, product, order, order_item  # noqa: F401
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
