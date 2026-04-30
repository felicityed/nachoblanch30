"""Backend API tests for Nacho 30 landing page."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://fiesta-nacho.preview.emergentagent.com").rstrip("/")
ADMIN_PASSWORD = "nacho30madrid"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def created_ids():
    return []


@pytest.fixture(scope="module", autouse=True)
def cleanup(session, created_ids):
    yield
    # cleanup any leftover RSVPs
    try:
        token = session.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD}).json().get("token")
        for rid in created_ids:
            session.delete(f"{BASE_URL}/api/admin/rsvps/{rid}", headers={"X-Admin-Token": token})
    except Exception:
        pass


# --- Root ---
class TestRoot:
    def test_root(self, session):
        r = session.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json().get("message") == "Nacho 30 API"


# --- RSVP creation ---
class TestRSVP:
    def test_rsvp_yes_full(self, session, created_ids):
        payload = {
            "attendance": "yes",
            "firstName": "TEST_Pedro",
            "lastName": "Garcia",
            "email": "pedro@test.com",
            "phone": "+34 600 111 222",
            "plusOne": "yes",
            "plusOneName": "Maria Lopez",
            "plusOneDiet": "vegetariano",
            "dietary": "none",
            "song": "Estopa - Tu calorro",
            "message": "Felicidades!",
        }
        r = session.post(f"{BASE_URL}/api/rsvp", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and len(data["id"]) > 0
        assert data["firstName"] == "TEST_Pedro"
        assert data["plusOneName"] == "Maria Lopez"
        assert data["attendance"] == "yes"
        created_ids.append(data["id"])

    def test_rsvp_no_minimal(self, session, created_ids):
        payload = {"attendance": "no", "firstName": "TEST_Ana", "lastName": "Ruiz"}
        r = session.post(f"{BASE_URL}/api/rsvp", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["attendance"] == "no"
        assert data["firstName"] == "TEST_Ana"
        created_ids.append(data["id"])

    def test_rsvp_missing_firstname(self, session):
        payload = {"attendance": "yes", "firstName": "", "lastName": "Doe"}
        r = session.post(f"{BASE_URL}/api/rsvp", json=payload)
        assert r.status_code == 400

    def test_rsvp_invalid_attendance(self, session):
        payload = {"attendance": "maybe", "firstName": "X", "lastName": "Y"}
        r = session.post(f"{BASE_URL}/api/rsvp", json=payload)
        assert r.status_code == 400


# --- Admin login ---
class TestAdminAuth:
    def test_login_correct(self, session):
        r = session.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        assert r.status_code == 200
        assert r.json().get("token") == ADMIN_PASSWORD

    def test_login_wrong(self, session):
        r = session.post(f"{BASE_URL}/api/admin/login", json={"password": "wrong"})
        assert r.status_code == 401


# --- Admin endpoints ---
class TestAdminRsvps:
    def test_list_without_token(self, session):
        r = session.get(f"{BASE_URL}/api/admin/rsvps")
        assert r.status_code == 401

    def test_list_wrong_token(self, session):
        r = session.get(f"{BASE_URL}/api/admin/rsvps", headers={"X-Admin-Token": "bad"})
        assert r.status_code == 401

    def test_list_with_token(self, session, admin_token):
        r = session.get(f"{BASE_URL}/api/admin/rsvps", headers={"X-Admin-Token": admin_token})
        assert r.status_code == 200
        body = r.json()
        assert "items" in body and isinstance(body["items"], list)
        stats = body.get("stats", {})
        for k in ("total", "coming", "declined", "plusOnes", "headcount"):
            assert k in stats
        # ensure no _id leaked
        for it in body["items"]:
            assert "_id" not in it

    def test_delete_without_token(self, session):
        r = session.delete(f"{BASE_URL}/api/admin/rsvps/anyid")
        assert r.status_code == 401

    def test_delete_nonexistent(self, session, admin_token):
        r = session.delete(
            f"{BASE_URL}/api/admin/rsvps/nonexistent-uuid-1234",
            headers={"X-Admin-Token": admin_token},
        )
        assert r.status_code == 404

    def test_delete_existing(self, session, admin_token):
        # create a tmp rsvp
        c = session.post(
            f"{BASE_URL}/api/rsvp",
            json={"attendance": "no", "firstName": "TEST_Tmp", "lastName": "Del"},
        )
        assert c.status_code == 200
        rid = c.json()["id"]
        d = session.delete(
            f"{BASE_URL}/api/admin/rsvps/{rid}",
            headers={"X-Admin-Token": admin_token},
        )
        assert d.status_code == 200
        assert d.json().get("deleted") is True
