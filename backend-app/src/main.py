import uvicorn
from fastapi import FastAPI
from src.auth.routes import router as auth_router
from src.database import Base, engine
from src.auth.model import User  # <-- important pour que create_all voie le modèle
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

app.include_router(auth_router)

@app.get("/", tags=["test"])
def root():
    return {"message": "ussef!"}
