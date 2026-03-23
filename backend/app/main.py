from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import products, suggestions
from app.routes.auth import router as auth_router

app = FastAPI()

# ✅ CORS CONFIG (PRODUCTION READY)
origins = [
    "https://asin-mappers.vercel.app",  # your frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # specific origin (safe)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ROUTES
app.include_router(products.router, prefix="/api")
app.include_router(suggestions.router, prefix="/api")
app.include_router(auth_router)

# ✅ TEST ROUTE
@app.get("/")
def home():
    return {"message": "Backend running"}