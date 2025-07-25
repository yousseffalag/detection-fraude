import uvicorn
from fastapi import FastAPI
from src.auth.routes import router as auth_router
from src.database import Base, engine

app = FastAPI()

@app.on_event("startup")
def startup_event():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

# # Monte le routeur auth avec le préfixe /auth (déjà dans routes.py)
app.include_router(auth_router)

@app.get("/", tags=["test"])
def root():
    return {"message": "ussef!"}
