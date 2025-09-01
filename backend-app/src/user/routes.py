from fastapi import APIRouter, Depends , Path , Body, Query
from src.user.services import get_user_statistics , get_users , delete_user , create_user, update_user
from typing import Optional
from src.auth.model import UserRole, User
from src.database import get_db
from sqlalchemy.orm import Session
from src.core.security import get_admin_user


router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/statistics")
def user_statistics( stats = Depends(get_user_statistics)):
    return stats

@router.get("/", summary="Get users with filters")
def list_users(
    search: Optional[str] = None,
    role: Optional[UserRole] = None,
    status: Optional[bool] = None,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Number of items per page"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    limit = 5
    return get_users(
        db=db,
        admin=admin,
        search=search,
        role=role,
        status=status,
        page=page,
        limit=limit,
    )


@router.delete("/{user_id}", summary="Delete a user (Admin only)")
def remove_user(
    user_id: int = Path(..., description="ID of the user to delete"),
    result = Depends(delete_user)
):
    return result

@router.post("/", summary="Create a new user (Admin only for admins)")
def add_user(
    username: str = Body(...),
    email: str = Body(...),
    password: Optional[str] = Body(None),  # mot de passe optionnel
    role: UserRole = Body(UserRole.user),
    is_verified: bool = Body(False),
    db: Session = Depends(get_db),
    admin = Depends(get_admin_user)
):
    user = create_user(
        username=username,
        email=email,
        password=password,
        role=role,
        is_verified=is_verified,
        db=db,
        admin=admin
    )
    return user

@router.patch("/{user_id}", summary="Update user info (Admin only)")
def modify_user(
    user_id: int = Path(..., description="ID of the user to update"),
    username: str = Body(None),
    email: str = Body(None),
    role: UserRole = Body(None),
    is_verified: bool = Body(None),
    db: Session = Depends(get_db),
    admin = Depends(get_admin_user)
):
    updated_user = update_user(
        user_id=user_id,
        username=username,
        email=email,
        role=role,
        is_verified=is_verified,
        db=db,
        admin=admin
    )
    return updated_user