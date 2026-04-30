from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ============ Models ============
class RSVPCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    attendance: str  # "yes" | "no"
    firstName: str
    lastName: str
    email: Optional[str] = ""
    phone: Optional[str] = ""
    plusOne: Optional[str] = "no"  # "yes" | "no"
    plusOneName: Optional[str] = ""
    plusOneDiet: Optional[str] = ""
    dietary: Optional[str] = "none"
    song: Optional[str] = ""
    message: Optional[str] = ""


class RSVP(RSVPCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AdminLogin(BaseModel):
    password: str


class AdminLoginResponse(BaseModel):
    token: str


# ============ Helpers ============
def verify_admin(token: Optional[str]) -> None:
    expected = os.environ.get('ADMIN_PASSWORD', '')
    if not token or token != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")


# ============ Routes ============
@api_router.get("/")
async def root():
    return {"message": "Nacho 30 API"}


@api_router.post("/rsvp", response_model=RSVP)
async def create_rsvp(payload: RSVPCreate):
    if payload.attendance not in ("yes", "no"):
        raise HTTPException(status_code=400, detail="attendance must be yes or no")
    if not payload.firstName.strip() or not payload.lastName.strip():
        raise HTTPException(status_code=400, detail="firstName and lastName are required")

    rsvp = RSVP(**payload.model_dump())
    doc = rsvp.model_dump()
    await db.rsvps.insert_one(doc)
    return rsvp


@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLogin):
    expected = os.environ.get('ADMIN_PASSWORD', '')
    if not expected or payload.password != expected:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    return AdminLoginResponse(token=expected)


@api_router.get("/admin/rsvps")
async def list_rsvps(x_admin_token: Optional[str] = Header(default=None)):
    verify_admin(x_admin_token)
    items = await db.rsvps.find({}, {"_id": 0}).sort("createdAt", -1).to_list(2000)
    total = len(items)
    coming = sum(1 for i in items if i.get("attendance") == "yes")
    declined = sum(1 for i in items if i.get("attendance") == "no")
    plus_ones = sum(1 for i in items if i.get("attendance") == "yes" and i.get("plusOne") == "yes")
    return {
        "items": items,
        "stats": {
            "total": total,
            "coming": coming,
            "declined": declined,
            "plusOnes": plus_ones,
            "headcount": coming + plus_ones,
        },
    }


@api_router.delete("/admin/rsvps/{rsvp_id}")
async def delete_rsvp(rsvp_id: str, x_admin_token: Optional[str] = Header(default=None)):
    verify_admin(x_admin_token)
    res = await db.rsvps.delete_one({"id": rsvp_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No encontrado")
    return {"deleted": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
