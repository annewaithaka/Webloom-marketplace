# 🚀 Webloom Tech Kenya Marketplace

Webloom Marketplace is a scalable multi-organization SaaS platform built for Webloom Tech Kenya.  
It allows management of users, clients, and their organizations — forming the foundation for a full marketplace ecosystem.

Repository:
git@github.com:annewaithaka/Webloom-marketplace.git

---

# 🏗 Project Structure

Webloom-marketplace/
│
├── backend/        # FastAPI backend (Python + UV)
├── frontend/       # React frontend (Vite)
└── README.md

---

# ⚙️ Tech Stack

## Backend
- Python 3.11+
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL (planned)
- UV (Python package manager)

## Frontend
- React (JavaScript)
- Vite
- Axios

---

# 🖥 Local Setup Guide

---

# 1️⃣ Clone the Repository

```bash
git clone git@github.com:annewaithaka/Webloom-marketplace.git
cd Webloom-marketplace

2️⃣ Backend Setup
Navigate to backend
cd backend

Install UV (if not installed)
curl -LsSf https://astral.sh/uv/install.sh | sh


Restart your terminal if necessary.

Create Virtual Environment
uv venv
source .venv/bin/activate

Install Dependencies
uv add fastapi
uv add uvicorn
uv add sqlalchemy
uv add psycopg2-binary
uv add alembic
uv add python-dotenv
uv add pydantic-settings

Run Backend
uvicorn app.main:app --reload


Backend will run at:

http://127.0.0.1:8000


Swagger docs:

http://127.0.0.1:8000/docs

3️⃣ Frontend Setup
Navigate to frontend
cd ../frontend

Install Dependencies
npm install

Run Frontend
npm run dev


Frontend runs at:

http://localhost:5173

🧠 Architecture Principles

Backend follows modular clean architecture:

Models → Database structure only

Schemas → Validation (request/response)

Services → Business logic

Routers → HTTP endpoints only

Frontend mirrors backend modules:

Users

Clients

Organizations

Each module contains its own service and page logic.