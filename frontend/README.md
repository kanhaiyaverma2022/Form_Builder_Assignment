
# 🎨 Simple Form Builder - Frontend

A basic form builder made with Next.js and React. You can drag and drop fields to build forms, customize them, and preview instantly.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

---

## ✏️ How It Works

### 1. Build Your Form

* Go to `/designer`
* Drag fields into the form area (Text, Select, Radio, Checkbox)

### 2. Edit Fields

* Click "Edit" on any field
* Change label, placeholder, required, etc.

### 3. Preview Form

* Click "Preview Form"
* Try filling and submitting the form

---

## 🧱 Field Types

* Text Input (email, phone, number, etc.)
* Textarea
* Select Dropdown
* Radio Buttons
* Multiple Checkboxes

---

## 📁 Project Structure

```
frontend/
├── pages/
│   ├── designer.js         # Form builder UI
│   └── forms/[id].js       # Preview and submit form
├── components/             # UI parts and config modals
├── context/                # Global state
└── styles/                 # Tailwind CSS
```

---

## 🔌 Connect to Backend

Form submits to:

```http
POST http://localhost:5000/forms/{formId}
```

Send JSON with form data.

---

## 🌈 Tech Stack

* Next.js
* React
* Tailwind CSS
* @dnd-kit (for drag-and-drop)
* Axios (for requests)

---

Perfect for making contact forms, surveys, or simple apps.

---


