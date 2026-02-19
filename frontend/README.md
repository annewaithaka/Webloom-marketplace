frontend/
├─ public/
│  ├─ index.html
│  ├─ favicon.ico
│  └─ assets/
│      ├─ images/
│      └─ icons/
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
│  │  └─ ...
│  ├─ config/
│  │  └─ apiConfig.js
│  ├─ context/
│  │  ├─ AuthContext.jsx
│  │  └─ SubscriptionContext.jsx
│  ├─ features/
│  │  ├─ Marketplace/
│  │  │  ├─ Marketplace.jsx
│  │  │  └─ ProductSetupForm.jsx
│  │  └─ Payments/
│  │     ├─ Checkout.jsx
│  │     └─ PaymentConfirmation.jsx
│  ├─ pages/
│  │  ├─ Home.jsx
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


backend/
├─ app/
│  ├─ __init__.py
│  ├─ config.py
│  ├─ extensions.py
│  ├─ utils/
│  │  ├─ __init__.py
│  │  ├─ email_utils.py
│  │  ├─ sms_utils.py
│  │  └─ payment_utils.py
│  ├─ models/
│  │  ├─ __init__.py
│  │  ├─ user.py
│  │  ...
│  ├─ auth/
│  │  ├─ __init__.py
│  │  ├─ routes.py
│  │  ...
│  ├─ modules/
│  │  ├─ marketplace/
│  │  │  ├─ __init__.py
│  │  │  ...
│  │  └─ payments/
│  │     ├─ __init__.py
│  │     ...
│  └─ tasks/
│     ├─ __init__.py
│     └─ subscription_tasks.py
├─ instance/
│  └─ config.py
├─ migrations/
├─ requirements.txt
├─ .gitignore
├─ run.py
└─ README.md
