# Webloom Tech Kenya Marketplace (MVP)

A centralized marketplace for Webloom products (starting with **Azani Smart Duka**) that supports:
- One-time client registration + login
- Multiple organizations (branches) per client
- Organization-level subscriptions (coming next)
- Future-ready structure for payments, notifications, and provisioning

---

## Tech Stack

- **Frontend:** React JS
- **Backend:** Flask (Python)
- **DB (now):** SQLite
- **DB (later):** PostgreSQL

---

## Repo Structure
Webloom-marketplace/
webloom-marketplace-frontend/
webloom-marketplace-backend/


## Backend Setup (Flask + SQLite)

### 1) Go to backend folder
```bash
cd webloom-marketplace-backend

2) Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate

3) Install dependencies
pip install -r requirements.txt

4) Create .env

Create a file named .env in webloom-marketplace-backend/:
FLASK_ENV=development
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me-too
DATABASE_URL=sqlite:///webloom.db

5) Run migrations
export FLASK_APP="run:app"
flask db migrate -m "init"
flask db upgrade

If you already have a migrations folder, you do not need flask db init.

6) Start the backend server
python run.py

Backend will run on:

http://127.0.0.1:5000

### Frontend Setup (React)

1) Go to frontend folder
cd ../webloom-marketplace-frontend

2) Install dependencies
npm install

3) Start frontend
npm run dev