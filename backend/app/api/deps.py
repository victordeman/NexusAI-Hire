from fastapi import Depends, HTTPException, Header, status
from typing import Optional
from app.core.supabase import supabase

async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Dependency to get the current authenticated user from Supabase.
    Expects a Bearer token in the Authorization header.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
        )
    
    try:
        # Expected format: "Bearer <token>"
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            # Fallback if just the token is sent, but Bearer is standard
            token = parts[0]
        else:
            token = parts[1]
        
        # Verify JWT with Supabase
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        
        return user_response.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
        )
