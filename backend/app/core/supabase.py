from supabase import create_client, Client
from app.config import settings

def get_supabase() -> Client:
    """
    Initialize and return a Supabase client.
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")
    
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Global supabase client instance
supabase: Client = get_supabase()
