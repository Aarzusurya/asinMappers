from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import products, suggestions
from app.routes.auth import router as auth_router

app = FastAPI()

# ✅ CORS CONFIG (LOCAL + PRODUCTION)
origins = [
    "https://asin-mappers.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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