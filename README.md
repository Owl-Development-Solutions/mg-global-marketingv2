# Davinci Resolve Fusion – Genealogy Networking System

**Davinci Resolve Fusion** is a full-stack genealogy networking system built with a modern Angular frontend and an Express backend. It is engineered to manage hierarchical relationships (referrals, binary trees, etc.) and visualize network structures with high efficiency.

---

## 🛠 Tech Stack

| Layer        | Technology                                   |
|--------------|----------------------------------------------|
| **Frontend** | Angular, Angular Material, NgRx, RxJS        |
| **Backend** | Node.js, Express                             |
| **Database** | MySQL |

---

## 📂 Project Structure

```text
root/
├── frontend/    # Angular application (State Management, UI)
└── backend/     # Node.js & Express API (Routing, Logic)
```

## Installation

Install dependencies for **both frontend and backend**.

Some packages may have peer dependency conflicts, so use one of the following commands:

 Both for frontend and backend folders
 
```bash
npm install --legacy-peer-deps
```

if error persist try to use this command: 

```bash
npm install --force
```

## 🚀 Running the Project

### Frontend
 **Navigate** to the frontend directory:
   ```bash
   cd frontend
   ```
Run the Angular development server:

```Bash
ng serve
```
Access the application:
The frontend will be running at: http://localhost:4200



### Backend
**Navigate** to the backend directory:
   ```bash
   cd backend
   ```
Run the development server:

```bash
npm run dev
```

Access the API:
The backend will be running at: http://localhost:8800

----

# System Overview

Davinci Resolve Fusion is a genealogy-based networking system that manages hierarchical relationships between users.

It supports structured tree relationships commonly used in:

Referral systems

Binary network structures

Multi-level relationship tracking

The system architecture uses:

NgRx for predictable state management

RxJS for reactive programming and asynchronous data flow

Express for backend API routing and business logic









