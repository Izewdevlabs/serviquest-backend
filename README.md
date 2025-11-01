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



