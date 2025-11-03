\# ServiQuest Backend 🚀



\[!\[Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)  

\[!\[License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)



\## Table of Contents

\- \[Overview](#overview)  

\- \[Features](#features)  

\- \[Tech Stack](#tech-stack)  

\- \[Getting Started](#getting-started)  

&nbsp; - \[Prerequisites](#prerequisites)  

&nbsp; - \[Installation](#installation)  

&nbsp; - \[Running Locally](#running-locally)  

\- \[Environment Variables](#environment-variables)  

\- \[API Documentation](#api-documentation)  

\- \[WebSocket Chat](#websocket-chat)  

\- \[Directory Structure](#directory-structure)  

\- \[Contributing](#contributing)  

\- \[License](#license)  

\- \[Contact](#contact)  



---



\## Overview  

ServiQuest is a professional-services marketplace connecting service providers (plumbers, electricians, pet sitters, etc.) with users needing those services.  

This repository houses the \*\*backend API\*\* built on Express.js, PostgreSQL/Sequelize, and real-time chat via Socket.io.



---



\## Features  

\- Authentication \& authorization (JWT)  

\- CRUD services listing (20 service types)  

\- Bookings \& payments integration (Stripe)  

\- Real-time chat between users \& providers  

\- Admin dashboard endpoints for stats \& management  

\- Swagger UI documentation at `/api-docs`



---



\## Tech Stack  

\- \*\*Node.js\*\* + \*\*Express.js\*\*  

\- \*\*PostgreSQL\*\* (via Sequelize ORM)  

\- \*\*Stripe\*\* for payments  

\- \*\*Socket.io\*\* for real-time chat  

\- \*\*Swagger UI\*\* for API docs  

\- Environment variables managed via `.env`  



---



\## Getting Started



\### Prerequisites  

\- Node.js v16+  

\- PostgreSQL installed and running  

\- Stripe account (test keys)  

\- Firebase service account (if using notifications)  



\### Installation  

```bash

git clone https://github.com/<YOUR-ORG>/serviquest-backend.git

cd serviquest-backend

npm install


Running Locally
# Set up .env (see below)
npm run dev


Server will run at http://localhost:5000, Swagger docs at http://localhost:5000/api-docs.

Environment Variables

Create a .env file in the root with the following keys (replace placeholders accordingly):

PORT=5000
DATABASE_URL=postgres://postgres:password@localhost:5432/serviquest_db
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLIC_KEY=pk_test_your_key_here
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"


Important: Do not commit your .env. Use .env.example instead.

API Documentation

Once the server is running, browse to:
http://localhost:5000/api-docs
Here you’ll find all routes documented, including auth, services, bookings, payments, admin endpoints.

WebSocket Chat

Under the hood, the backend uses Socket.io to facilitate chat between users and service providers.
Key events:

joinRoom: join a chat room by roomId

sendMessage: send a message object to the room

receiveMessage: event emitted to all room participants

Directory Structure
serviquest-backend/
│  ├─ src/
│  │   ├─ controllers/
│  │   ├─ models/
│  │   ├─ routes/
│  │   ├─ config/
│  │   └─ server.js
│  ├─ .env.example
│  ├─ .gitignore
│  └─ README.md

Contributing

Contributions are welcome!

Fork the repo

Create your branch: git checkout -b feature/my-feature

Commit your changes: git commit -m 'Add some feature'

Push to the branch: git push origin feature/my-feature

Open a Pull Request and reference relevant issues

Please follow the code style used throughout the repo and include tests if adding features.

License

This project is licensed under the MIT License – see the LICENSE
 file for details.

Contact

Izew Dev Labs – Twitter
 | Website

Feel free to open issues or discussion for assistance or feature requests.
