# 🧾 Simple Form Builder - Backend

A lightweight Node.js + Express backend to receive and store form submissions as JSON files.

---

## 🚀 Getting Started

### 1. Install dependencies:

```bash
npm install
```

### 2. Start the server:

```bash
# For development (auto restart)
npm run dev


```

The server will run on: `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── controllers/       # Handles form logic
│   └── formController.js
├── routes/            # API routes
│   └── formRoutes.js
├── data/              # Stores form data (JSON files)
├── server.js          # Starts the server
└── package.json
```

---

## 🔗 API

### ➔ Submit a form

**POST** `/forms/:id`


---

## 💾 How Data is Stored

* A new file is created for every form submission.
* Saved in the `data/` folder.
* File name format: `form_{formId}_{timestamp}.json`

---

## ✅ Features

* Handles JSON data
* Allows requests from any frontend (CORS enabled)
* Auto-creates `data/` folder if missing
* Includes a health check at `GET /health`

---

Perfect backend to connect with your custom form builder! 🖠️
