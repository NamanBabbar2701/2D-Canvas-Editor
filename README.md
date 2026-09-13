# 🎨 2D Canvas Editor

A lightweight web-based 2D canvas editor built with React, Fabric.js and Firebase Firestore.

The application allows users to create individual canvases, draw objects, edit them and persist their work using Firestore.

## ✨ Features

- Create a new canvas
- Unique canvas URL for every canvas
- Rectangle tool
- Circle tool
- Text tool
- Pen / freehand drawing tool
- Select and manipulate objects
- Move, resize and rotate objects
- Edit text
- Change object colors
- Save canvas state to Firestore
- Restore canvas state from the same URL
- Responsive interface
- No authentication required

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React | UI development |
| Vite | Development and build tooling |
| Fabric.js | 2D canvas and object manipulation |
| Firebase | Backend services |
| Cloud Firestore | Canvas persistence |
| React Router | Canvas URL routing |

---

## 🏗️ Application Flow

```text
Home Page
    │
    ▼
Create New Canvas
    │
    ▼
Create Firestore Document
    │
    ▼
Get Firestore Document ID
    │
    ▼
/canvas/:canvasId
    │
    ▼
Canvas Editor
    │
    ▼
Edit & Save Canvas

```
---

## 📁Project Structure

```text

canvas-editor/
├── src/
│   ├── pages/
│   │   └── Canvas.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
├── public/
├── package.json
├── package-lock.json
└── README.md

```
The project structure will evolve as additional editor functionality is implemented.

---

## 🚀 Getting Started

**Prerequisites**

- Node.js
- npm
- A Firebase project

**Installation**

Clone the repository:

```bash
git clone https://github.com/NamanBabbar2701/2D-Canvas-Editor
cd canvas-editor
```
Install dependencies

```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The application will be available at the local URL provided by Vite.

---

## 🔥 Firebase Configuration

The application uses Firebase Firestore for storing canvas data.

Create a Firebase project and configure Firestore before running the application.

The Firebase configuration is maintained in:
```text
src/firebase.js
```

Firebase configuration should be handled appropriately before deploying the application publicly.

---

## 🗄️ Firestore

Canvas documents are stored in the:
```text
canvases
```
collection.

Each newly created canvas receives a unique Firestore document ID.

That document ID becomes the canvas ID used in the application URL:
```text
/canvas/:canvasId
```

---

## 🧪 Development

The project is being developed incrementally in phases.

Detailed implementation decisions, challenges and progress are documented separately in:
```text
canvas-editor/README.md
```

---

## 📌 Current Status
**🚧 Under Development**
The project is being built phase-by-phase, with the required functionality prioritized before optional improvements.

### 🛣️ RoadMap
- [x] React + Vite foundation
- [x] Home page
- [x] Firebase configuration
- [x] Firestore integration
- [x] Canvas creation
- [x] Canvas ID generation
- [x] Canvas URL routing
- [x] Fabric.js canvas
- [x] Rectangle tool
- [x] Circle tool
- [x] Text tool
- [x] Pen tool
- [x] Object manipulation
- [x] Text and color editing
- [ ] Canvas persistence
- [ ] UI polish and testing
- [ ] Deployment

## 👨‍💻 Author
**Naman Babbar**