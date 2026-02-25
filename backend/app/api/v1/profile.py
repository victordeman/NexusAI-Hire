from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.api.deps import get_current_user
from app.core.supabase import supabase

router = APIRouter()

class ProfileUpdate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    home_address: str
    date_of_birth: str
    department: str
    job_designation: str
    is_admin: bool = False

@router.get("/me")
async def get_my_profile(current_user: object = Depends(get_current_user)):
    try:
        # Note: current_user.id is the UUID from Supabase Auth
        result = supabase.table("profiles").select("*").eq("id", current_user.id).single().execute()
        return result.data
    except Exception as e:
        # If profile doesn't exist, we might get an error or empty data depending on how Supabase client handles it
        # Usually it raises an exception if .single() finds nothing
        return None

@router.post("/me")
async def update_my_profile(profile: ProfileUpdate, current_user: object = Depends(get_current_user)):
    try:
        profile_data = profile.model_dump()
        profile_data["id"] = current_user.id
        
        # Upsert profile: updates if ID exists, inserts if not
        result = supabase.table("profiles").upsert(profile_data).execute()
        
        if not result.data:
             # Some error occurred or no data returned
             raise HTTPException(status_code=500, detail="Failed to update profile - no data returned")
             
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")
