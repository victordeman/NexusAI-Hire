from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, AliasChoices
from typing import Optional

class Settings(BaseSettings):
    """
    Application settings for NexusAI Hire.
    Uses pydantic-settings to load from environment variables and .env file.
    """
    # App Settings
    APP_TITLE: str = "NexusAI Hire API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    # LiteLLM Settings
    LITELLM_MODEL: str = Field(default="gpt-4o-mini")
    LITELLM_API_KEY: Optional[str] = Field(
        default=None, 
        validation_alias=AliasChoices('LITELLM_API_KEY', 'OPENAI_API_KEY')
    )
    LITELLM_BASE_URL: Optional[str] = Field(
        default=None, 
        validation_alias=AliasChoices('LITELLM_BASE_URL', 'OLLAMA_BASE_URL')
    )
    
    # Supabase Settings
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None

    # Database configuration (for future use)
    DATABASE_URL: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Global settings instance
settings = Settings()
