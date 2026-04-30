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
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

resend.api_key = os.environ.get('RESEND_API_KEY', '')

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

    if payload.attendance == "yes" and payload.email:
        try:
            html_body = f"""
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0c1a;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0c1a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#0d1334;border:1px solid #c9a961;border-radius:8px;overflow:hidden;">

        <tr>
          <td style="background-color:#0a0c1a;padding:40px 40px 20px;text-align:center;border-bottom:1px solid #c9a961;">
            <p style="margin:0;font-size:28px;color:#c9a961;letter-spacing:6px;text-transform:uppercase;">Nacho · 30</p>
          </td>
        </tr>

        <tr>
          <td style="padding:40px 40px 20px;text-align:center;">
            <p style="font-size:32px;margin:0 0 24px;">🥂</p>
            <p style="color:#fdfbf7;font-size:18px;line-height:1.7;margin:0 0 16px;">
              ¡Gracias por confirmar, <strong style="color:#c9a961;">{payload.firstName}</strong>!
            </p>
            <p style="color:#c8c0b0;font-size:16px;line-height:1.8;margin:0 0 32px;">
              Cuento contigo para celebrar mis 30.<br>
              Nos vemos el <strong style="color:#fdfbf7;">sábado 5 de septiembre a las 20:30h</strong><br>
              en <strong style="color:#fdfbf7;">Casa Madrid</strong>.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0c1a;border:1px solid rgba(201,169,97,0.3);border-radius:6px;">
              <tr>
                <td style="padding:24px 28px;">
                  <p style="margin:0 0 10px;color:#c9a961;font-size:13px;letter-spacing:3px;text-transform:uppercase;">Detalles</p>
                  <p style="margin:0 0 8px;color:#fdfbf7;font-size:15px;">📅 Sábado 5 · Septiembre · 2026 · 20:30h</p>
                  <p style="margin:0 0 8px;color:#fdfbf7;font-size:15px;">📍 Paseo de la Castellana, 134 · 28046 Madrid</p>
                  <p style="margin:0 0 8px;color:#c8c0b0;font-size:14px;">🚇 Metro: Cuzco (L10)</p>
                  <p style="margin:12px 0 0;color:#c9a961;font-size:14px;">👔 Dress code: elegante / cocktail</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px 40px;text-align:center;">
            <p style="color:#fdfbf7;font-size:18px;margin:0 0 8px;">¡Qué ganas! 🙌</p>
            <p style="color:#c9a961;font-size:16px;margin:0;font-style:italic;">— Nacho</p>
          </td>
        </tr>

        <tr>
          <td style="background-color:#0a0c1a;padding:20px 40px;text-align:center;border-top:1px solid rgba(201,169,97,0.2);">
            <p style="margin:0;color:#6b6560;font-size:12px;">nachoblanch30.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""
            resend.Emails.send({
                "from": "noreply@nachoblanch30.com",
                "to": [payload.email],
                "subject": "¡Nos vemos el 5 de Septiembre! 🎉",
                "html": html_body,
            })
        except Exception as e:
            logger.error(f"Error sending confirmation email: {e}")

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
