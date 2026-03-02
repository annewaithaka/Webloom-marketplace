```text
.
├── README.md
├── backend
│   ├── .env
│   ├── .gitignore
│   ├── README.md
│   ├── app
│   │   ├── __init__.py
│   │   ├── admin
│   │   ├── auth
│   │   │   ├── __init__.py
│   │   │   ├── controllers.py
│   │   │   ├── routes.py
│   │   │   └── validators.py
│   │   ├── config.py
│   │   ├── errors.py
│   │   ├── extensions.py
│   │   ├── integrations
│   │   ├── logging.py
│   │   ├── models
│   │   │   ├── __init__.py
│   │   │   ├── client.py
│   │   │   ├── notification.py
│   │   │   ├── organization.py
│   │   │   ├── payment.py
│   │   │   ├── plan.py
│   │   │   ├── product.py
│   │   │   ├── product_configuration.py
│   │   │   ├── subscription.py
│   │   │   └── user.py
│   │   ├── modules
│   │   │   ├── __init__.py
│   │   │   ├── marketplace
│   │   │   │   ├── __init__.py
│   │   │   │   ├── controllers.py
│   │   │   │   ├── routes.py
│   │   │   │   ├── services.py
│   │   │   │   └── validators.py
│   │   │   └── payments
│   │   │       ├── __init__.py
│   │   │       ├── controllers.py
│   │   │       ├── routes.py
│   │   │       └── services.py
│   │   ├── repositories
│   │   ├── schemas
│   │   ├── tasks
│   │   │   ├── __init__.py
│   │   │   └── subscription_tasks.py
│   │   ├── utils
│   │   │   ├── __init__.py
│   │   │   ├── access_control.py
│   │   │   ├── email_tokens.py
│   │   │   ├── email_utils.py
│   │   │   ├── payment_utils.py
│   │   │   └── sms_utils.py
│   │   └── webhooks
│   ├── requirements.txt
│   ├── run.py
│   ├── seed.py
│   └── tests
├── frontend
│   ├── .env
│   ├── .gitignore
│   ├── README.md
│   ├── backend
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── package.json.bak
│   ├── public
│   │   ├── assets
│   │   │   ├── icons
│   │   │   └── images
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src
│   │   ├── App.jsx
│   │   ├── api
│   │   │   ├── auth.js
│   │   │   ├── marketplace.js
│   │   │   ├── payments.js
│   │   │   └── subscriptions.js
│   │   ├── assets
│   │   │   ├── icons
│   │   │   └── images
│   │   ├── components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificationToast.jsx
│   │   │   └── guards
│   │   │       └── ProtectedRoute.jsx
│   │   ├── config
│   │   │   └── apiConfig.js
│   │   ├── context
│   │   │   ├── AuthContext.jsx
│   │   │   └── SubscriptionContext.jsx
│   │   ├── features
│   │   │   ├── Marketplace
│   │   │   │   ├── Marketplace.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   └── ProductSetupForm.jsx
│   │   │   └── Payments
│   │   │       ├── Checkout.jsx
│   │   │       └── PaymentConfirmation.jsx
│   │   ├── forms
│   │   ├── hooks
│   │   │   └── useAuth.js
│   │   ├── layouts
│   │   │   └── DashboardLayout.jsx
│   │   ├── lib
│   │   │   └── api.js
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── OrganizationForm.jsx
│   │   │   ├── Organizations.jsx
│   │   │   ├── Plans.jsx
│   │   │   ├── ProductPlans.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SetupPayment.jsx
│   │   │   └── SubscriptionPage.jsx
│   │   ├── routes
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── AppShell.jsx
│   │   │   └── RequireAuth.jsx
│   │   ├── styles
│   │   │   ├── app.css
│   │   │   ├── index.css
│   │   │   └── variables.css
│   │   └── utils
│   │       ├── formatMoney.js
│   │       └── storage.js
│   └── vite.config.js
└── package.json

40 directories, 99 files
```
