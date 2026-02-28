webloom-marketplace-backend/
├─ app/
│  ├─ __init__.py
│  ├─ config.py
│  ├─ extensions.py
│  ├─ errors.py
│  ├─ logging.py
│  ├─ utils/
│  │  ├─ __init__.py
│  │  ├─ email_utils.py
│  │  ├─ sms_utils.py
│  │  └─ payment_utils.py
│  ├─ integrations/              # NEW (3rd-party API clients)
│  │  ├─ __init__.py
│  │  ├─ azani_client.py         # (planned)
│  │  ├─ mpesa_client.py         # (planned)
│  │  ├─ email_provider.py       # (planned)
│  │  └─ sms_provider.py         # (planned)
│  ├─ schemas/                   # NEW (request/response shapes)
│  │  ├─ __init__.py
│  │  ├─ auth.py                 # (planned)
│  │  └─ organization.py         # (planned)
│  ├─ repositories/              # NEW (DB query helpers)
│  │  ├─ __init__.py
│  │  ├─ user_repo.py            # (planned)
│  │  ├─ client_repo.py          # (planned)
│  │  └─ organization_repo.py    # (planned)
│  ├─ models/
│  │  ├─ __init__.py
│  │  ├─ user.py
│  │  ├─ client.py               # NEW (now implemented)
│  │  ├─ organization.py         # NEW (now implemented)
│  │  ├─ product.py              # planned
│  │  ├─ plan.py                 # planned
│  │  ├─ subscription.py         # planned
│  │  ├─ payment.py              # planned
│  │  ├─ notification.py         # planned
│  │  └─ product_configuration.py# planned
│  ├─ auth/
│  │  ├─ __init__.py
│  │  ├─ routes.py               # implemented (register/login)
│  │  ├─ controllers.py          # planned
│  │  └─ validators.py           # planned
│  ├─ modules/
│  │  ├─ __init__.py
│  │  └─ marketplace/
│  │     ├─ __init__.py
│  │     ├─ routes.py            # NEW (org endpoints implemented)
│  │     ├─ controllers.py       # planned
│  │     ├─ services.py          # planned
│  │     └─ validators.py        # planned
│  ├─ payments/                  # (optional module grouping)
│  │  ├─ __init__.py
│  │  ├─ routes.py               # planned
│  │  ├─ controllers.py          # planned
│  │  └─ services.py             # planned
│  ├─ webhooks/                  # NEW (payment callbacks)
│  │  ├─ __init__.py
│  │  ├─ routes.py               # planned
│  │  └─ controllers.py          # planned
│  ├─ admin/                     # NEW (minimal admin override endpoints)
│  │  ├─ __init__.py
│  │  ├─ routes.py               # planned
│  │  └─ controllers.py          # planned
│  └─ tasks/
│     ├─ __init__.py
│     └─ subscription_tasks.py   # planned
├─ instance/
│  └─ config.py
├─ migrations/
│  └─ versions/
├─ tests/                        # NEW
│  ├─ __init__.py
│  └─ test_health.py             # (planned)
├─ .env                          # local only (gitignored)
├─ requirements.txt
├─ .gitignore
├─ run.py
└─ README.md


webloom-marketplace-frontend/
├─ public/
│  ├─ index.html
│  ├─ favicon.ico
│  └─ assets/
│     ├─ images/
│     └─ icons/
├─ src/
│  ├─ api/
│  │  ├─ auth.js
│  │  ├─ marketplace.js
│  │  ├─ subscriptions.js
│  │  └─ payments.js
│  ├─ assets/
│  │  ├─ images/
│  │  └─ icons/
│  ├─ components/
│  │  ├─ Navbar.jsx
│  │  ├─ Footer.jsx
│  │  ├─ Button.jsx
│  │  ├─ Card.jsx
│  │  ├─ NotificationToast.jsx
│  │  └─ guards/                 # NEW
│  │     ├─ ProtectedRoute.jsx    # NEW
│  │     └─ AdminRoute.jsx        # (planned)
│  ├─ layouts/                    # NEW
│  │  ├─ AuthLayout.jsx           # (planned)
│  │  └─ DashboardLayout.jsx      # NEW
│  ├─ hooks/                      # NEW
│  │  ├─ useAuth.js               # NEW
│  │  ├─ useOrganizations.js      # (planned)
│  │  └─ useSubscriptions.js      # (planned)
│  ├─ utils/                      # NEW
│  │  ├─ storage.js               # NEW
│  │  ├─ date.js                  # (planned)
│  │  └─ formatMoney.js           # (planned)
│  ├─ forms/                      # NEW (optional but useful)
│  │  ├─ LoginForm.jsx            # (planned)
│  │  └─ RegisterForm.jsx         # (planned)
│  ├─ config/
│  │  └─ apiConfig.js
│  ├─ context/
│  │  ├─ AuthContext.jsx
│  │  └─ SubscriptionContext.jsx
│  ├─ features/
│  │  ├─ Marketplace/
│  │  │  ├─ Marketplace.jsx
│  │  │  ├─ ProductCard.jsx
│  │  │  └─ ProductSetupForm.jsx
│  │  └─ Payments/
│  │     ├─ Checkout.jsx
│  │     └─ PaymentConfirmation.jsx
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ Login.jsx
│  │  ├─ Register.jsx
│  │  ├─ Dashboard.jsx
│  │  ├─ OrganizationForm.jsx
│  │  └─ SubscriptionPage.jsx
│  ├─ routes/
│  │  └─ AppRoutes.jsx
│  ├─ styles/
│  │  ├─ app.css
│  │  ├─ index.css
│  │  └─ variables.css
│  ├─ App.jsx
│  └─ main.jsx
├─ package.json
├─ .gitignore
└─ README.md