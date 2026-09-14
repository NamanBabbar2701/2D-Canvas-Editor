# 🎨 2D Canvas Editor

A lightweight web-based 2D canvas editor built as part of an SDE internship assignment.

The project allows users to create individual canvases, add and manipulate objects, draw freely, edit text, change colors, and persist their work using Firebase Firestore.

## 🌐 Live Demo

[Open the Live Demo](https://2-d-canvas-editor-rho.vercel.app/)

## ✨ Features

- Create a new canvas
- Unique URL for every canvas
- Rectangle, Circle and Text tools
- Freehand drawing
- Move, resize and rotate objects
- Edit text
- Change object colors
- Delete objects
- Select all objects
- Save canvas to Firestore
- Restore saved canvas using its URL
- Save status indicator
- Loading and error states

## 🛠️ Tech Stack

- React
- Vite
- Fabric.js
- Firebase Firestore
- React Router
- React Icons
- Vercel

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
Firestore Document ID
    │
    ▼
/canvas/:canvasId
    │
    ▼
Canvas Editor
    │
    ├── Add objects
    ├── Edit objects
    ├── Draw
    └── Change colors
    │
    ▼
Save
    │
    ▼
Firestore

```

## 📂 Repository Structure

```text
2D-Canvas-Editor/
│
├── canvas-editor/       # Main React application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── architecture.png     # Architecture diagram
├── 2D-Canvas-Editor.drawio
├── SDE Intern Task (1).pdf
└── README.md

```

## 📃 Documentation
The [`canvas-editor`](./canvas-editor) folder contains the actual React application and its technical documentation.

For detailed information about:

- Local Setup
- Firebase configuration
- Firestore structure
- Canvas persistence
- Keyboard shortcuts
- Implementation details
- Challenges and solutions

see:

[`canvas-editor/README.md`](./canvas-editor/README.md)

## 🧩 Architecture

### 📌 Project Status
**Completed**

The required canvas editing, routing, Firebase persistence and deployment functionality has been implemented and tested.

### 🔗 Links
- Live Demo: [`2D Canvas Editor`](https://2-d-canvas-editor-rho.vercel.app/)
- Application: [`canvas-editor/`](./canvas-editor)
- Technical Documentation: [`canvas-editor/README.md`](./canvas-editor/README.md)
- Architecture Diagram: [`architecture.png`](./architecture.png)
- Draw.io Source: [`2D-Canvas-Editor.drawio`](https://drive.google.com/file/d/1YyLWW9JKnZ_8XmR59Lig0H3zDwa3YYbb/view?usp=sharing)


## 👨‍💻 Author
**Naman Babbar**