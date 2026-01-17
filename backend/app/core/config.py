import os
from dataclasses import dataclass


def _parse_origins(value: str | None) -> list[str]:
    if not value:
        return ["http://localhost:5173"]
    # Permite: "https://tuapp.vercel.app,http://localhost:5173"
    return [x.strip() for x in value.split(",") if x.strip()]


@dataclass(frozen=True)
class Settings:
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "CHANGE_ME_SUPER_SECRET_KEY")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24h

    CORS_ORIGINS: list[str] = tuple(_parse_origins(os.getenv("CORS_ORIGINS")))


settings = Settings()
