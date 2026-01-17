from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import create_db_and_tables, get_session
from app.routes import health, auth, products, checkout, orders


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()

    # Seed productos demo (solo si DB vacía)
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


ALLOWED_ORIGINS = [
    "https://web-systems-ecommerce.vercel.app",
    "http://localhost:5173",  
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=False,   
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(checkout.router)
app.include_router(orders.router)
