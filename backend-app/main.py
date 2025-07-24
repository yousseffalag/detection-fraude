import uvicorn
from fastapi import FastAPI
from src.auth.routes import router as auth_router
from src.database import Base, engine


Base.metadata.create_all(bind=engine)

app = FastAPI()

# # Monte le routeur auth avec le préfixe /auth (déjà dans routes.py)
app.include_router(auth_router)

@app.get("/", tags=["test"])
def root():
    return {"message": "Hello, World!"}
