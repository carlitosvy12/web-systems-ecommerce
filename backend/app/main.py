from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import create_db_and_tables
from app.routes import health, auth, products, checkout, orders
from app.db import get_session


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()

    # Seed productos demo (solo si DB vacía)
    # OJO: esto es para que el frontend tenga algo que mostrar desde el minuto 1.
    session_gen = get_session()
    session = next(session_gen)
    try:
        products.seed_products_if_empty(session)
    finally:
        try:
            session.close()
        except Exception:
            pass

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.CORS_ORIGINS),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(checkout.router)
app.include_router(orders.router)
