from sqlalchemy.orm import Session
from sqlalchemy import func, extract , or_
from fastapi import Depends , HTTPException , status
from src.database import get_db
from src.auth.model import User, UserRole
from src.core.security import get_admin_user , hash_password
from datetime import datetime, timedelta
from typing import List, Optional

def calculate_percentage_change(current: int, previous: int) -> float:
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return ((current - previous) / previous) * 100

def get_user_statistics(db: Session = Depends(get_db), admin: User = Depends(get_admin_user) ):
    now = datetime.utcnow()
    current_month = now.month
    current_year = now.year

    # Période actuelle
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_verified == True).scalar()
    admins = db.query(func.count(User.id)).filter(User.role == UserRole.admin).scalar()
    new_this_month = db.query(func.count(User.id)).filter(
        extract('month', User.created_at) == current_month,
        extract('year', User.created_at) == current_year
    ).scalar()

    # Période précédente (mois dernier)
    prev_month = (now.replace(day=1) - timedelta(days=1))
    prev_month_num = prev_month.month
    prev_year = prev_month.year

    total_users_prev = db.query(func.count(User.id)).filter(
        extract('year', User.created_at) <= prev_year,
        extract('month', User.created_at) <= prev_month_num
    ).scalar()

    active_users_prev = db.query(func.count(User.id)).filter(
        User.is_verified == True,
        extract('year', User.created_at) <= prev_year,
        extract('month', User.created_at) <= prev_month_num
    ).scalar()

    admins_prev = db.query(func.count(User.id)).filter(
        User.role == UserRole.admin,
        extract('year', User.created_at) <= prev_year,
        extract('month', User.created_at) <= prev_month_num
    ).scalar()

    new_last_month = db.query(func.count(User.id)).filter(
        extract('month', User.created_at) == prev_month_num,
        extract('year', User.created_at) == prev_year
    ).scalar()

    return {
        "total_users": {
            "count": total_users,
            "change_percentage": calculate_percentage_change(total_users, total_users_prev)
        },
        "active_users": {
            "count": active_users,
            "change_percentage": calculate_percentage_change(active_users, active_users_prev)
        },
        "admins": {
            "count": admins,
            "change_percentage": calculate_percentage_change(admins, admins_prev)
        },
        "new_this_month": {
            "count": new_this_month,
            "change_percentage": calculate_percentage_change(new_this_month, new_last_month)
        }
    }

def get_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
    search: Optional[str] = None,
    role: Optional[UserRole] = None,
    status: Optional[bool] = None
) -> List[dict]:
    query = db.query(User)

    # 🔎 Filtre texte (nom ou email)
    if search:
        query = query.filter(
            or_(
                User.username.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )

    # 🎭 Filtre rôle
    if role:
        query = query.filter(User.role == role)

    # ✅ Filtre statut (active/inactive)
    if status is not None:
        query = query.filter(User.is_verified == status)

    users = query.all()

    # Transformation en dictionnaire
    result = []
    for user in users:
        result.append({
            "username": user.username,
            "email": user.email,
            "role": user.role.value if isinstance(user.role, UserRole) else user.role,
            "status": user.is_verified ,
            "joinDate": user.created_at.strftime("%Y-%m-%d") if user.created_at else None
        })

    return result

def delete_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    return {"detail": f"User {user.username} deleted successfully."}



def create_user(
    username: str,
    email: str,
    password: str = None,  # mot de passe optionnel
    role: UserRole = UserRole.user,
    is_verified: bool = False,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)  # obligatoire seulement si role != user
):
    # Vérifie si l'email ou le username existe déjà
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Si quelqu'un essaie de créer un admin, il doit être admin lui-même
    if role == UserRole.admin and admin.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Only admins can create another admin")

    # 🔹 Utiliser mot de passe par défaut si aucun mot de passe fourni
    if not password:
        password = "1234"

    hashed_password = hash_password(password)
    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        role=role,
        is_verified=is_verified
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role.value,
        "status": "active" if new_user.is_verified else "inactive",
        "joinDate": new_user.created_at.strftime("%Y-%m-%d"),
        "password": password  # optionnel : tu peux renvoyer le mot de passe par défaut pour info
    }

def update_user(
    user_id: int,
    username: str = None,
    email: str = None,
    role: UserRole = None,
    is_verified: bool = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Vérifier unicité email/username si changé
    if username and username != user.username:
        if db.query(User).filter(User.username == username).first():
            raise HTTPException(status_code=400, detail="Username already taken")
        user.username = username

    if email and email != user.email:
        if db.query(User).filter(User.email == email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        user.email = email

    if role:
        # Seul un admin peut créer un autre admin
        if role == UserRole.admin and admin.role != UserRole.admin:
            raise HTTPException(status_code=403, detail="Only admins can assign admin role")
        user.role = role

    if is_verified is not None:
        user.is_verified = is_verified

    db.commit()
    db.refresh(user)
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role.value,
        "status": "active" if user.is_verified else "inactive",
        "joinDate": user.created_at.strftime("%Y-%m-%d")
    }
