from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Database
    DATABASE_URL: str

    # JWT
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 30

    # Gemini
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # LLM (optionnel, générique)
    LLM_PROVIDER: str | None = None
    LLM_API_KEY: str | None = None
    LLM_MODEL: str | None = None


settings = Settings()
