# 🎨 2D Canvas Editor

A lightweight web-based 2D canvas editor built with **React, Fabric.js, and Firebase Firestore**.

The editor allows users to create a canvas, add different types of objects, edit and manipulate them, draw freely, and save their work. Each canvas has its own URL, so a saved canvas can be opened again using the same link.

## ✨ Features

- Create a new canvas
- Unique URL for every canvas
- Rectangle tool
- Circle tool
- Text tool
- Pen / freehand drawing tool
- Select and manipulate objects
- Move, resize, and rotate objects
- Edit text directly on the canvas
- Change object colors
- Delete selected objects
- Select all objects with `Ctrl + A`
- Save canvas state to Firebase Firestore
- Restore saved canvas state after refreshing
- `Ctrl + S` keyboard shortcut
- Saved / Unsaved Changes / Saving status
- Loading state while opening a canvas
- Error handling for invalid canvas URLs
- Responsive interface

Authentication is not implemented because it was not required for the assignment.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React | UI and application logic |
| Vite | Development and build tooling |
| Fabric.js | Canvas rendering and object manipulation |
| Firebase | Backend services |
| Cloud Firestore | Canvas persistence |
| React Router | URL-based canvas routing |
| React Icons | Toolbar icons |
| Vercel | Deployment |

---

## 🏗️ Application Structure

The application has two main routes:

```text
/
└── Home
    └── Create New Canvas

/canvas/:canvasId
└── Canvas Editor
```

The Home page creates a new Firestore document and uses the generated document ID as the canvas ID.

For example:

```text
/canvas/abc123xyz
```

When this URL is opened, the application retrieves the corresponding canvas from Firestore and loads it into Fabric.js.

---

## 🔄 Application Flow

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
Get Document ID
    │
    ▼
/canvas/:canvasId
    │
    ▼
Canvas Editor
    │
    ├── Add Objects
    ├── Edit Objects
    ├── Draw
    └── Change Colors
    │
    ▼
Save Canvas
    │
    ▼
Firestore
```

---

## 💾 Canvas Persistence

The canvas state is stored in Firebase Firestore.

Fabric.js provides the canvas data through `toJSON()`. Before storing it in Firestore, the data is converted into a JSON string.

```js
const canvasData = JSON.stringify(canvas.toJSON());
```

The saved data is then stored in the corresponding canvas document along with an update timestamp.

When the canvas is opened again, the stored string is parsed and loaded back into Fabric.js.

```text
Fabric.js Canvas
       │
       ▼
    toJSON()
       │
       ▼
JSON.stringify()
       │
       ▼
   Firestore
       │
       ▼
 JSON.parse()
       │
       ▼
loadFromJSON()
       │
       ▼
Restored Canvas
```

### Firestore Structure

Canvas documents are stored in the `canvases` collection.

```text
canvases/
└── {canvasId}
    ├── name
    ├── data
    ├── createdAt
    └── updatedAt
```

The Firestore document ID is used as the `canvasId` in the application URL.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + A` | Select all objects |
| `Ctrl + S` | Save canvas |
| `Delete` | Delete selected objects |
| Double-click text | Edit text |

`Backspace` is intentionally left available for normal text editing.

---

## 📁 Project Structure

```text
canvas-editor/
├── public/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Canvas.jsx
│   │   └── Canvas.css
│   ├── App.jsx
│   ├── App.css
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
├── vite.config.js
└── README.md
```

---

## 🧠 Implementation Details

### Fabric.js and React

The Fabric.js canvas instance is stored using React's `useRef`.

This allows the Fabric.js instance to remain available across React renders without putting the canvas object into React state.

`useEffect` is used for the Fabric.js lifecycle:

- Create the canvas
- Load saved canvas data
- Register event listeners
- Register keyboard shortcuts
- Clean up the Fabric.js instance when the component is unmounted

### Object Manipulation

Fabric.js handles the interaction with canvas objects.

Objects can be selected and manipulated directly on the canvas, including:

- Moving
- Scaling
- Rotating
- Editing text

### Drawing

The Pen tool uses Fabric.js's `PencilBrush`.

The brush is initialized when required:

```js
if (!canvas.freeDrawingBrush) {
  canvas.freeDrawingBrush = new PencilBrush(canvas);
}
```

The drawing mode can then be toggled through the toolbar.

### Save Status

The editor keeps track of the current save state:

```text
Saved
Unsaved Changes
Saving...
```

A save version counter is used when saving. This prevents the UI from incorrectly showing `Saved` if the user makes another change while a previous save request is still in progress.

---

## 🐛 Challenges & Solutions

While building the editor, a few issues came up during development.

### 1. Storing Fabric.js data in Firestore

Initially, the Fabric.js canvas data was being passed directly to Firestore. This caused errors because some nested values were not suitable for Firestore.

The solution was to serialize the canvas data into a JSON string before saving:

```js
JSON.stringify(canvas.toJSON())
```

The string is parsed again when the canvas is loaded.

---

### 2. Freehand drawing brush

The Pen tool initially failed because a drawing brush was not always available on the Fabric.js canvas.

I fixed this by explicitly creating a `PencilBrush` when needed.

---

### 3. Async canvas loading and React Strict Mode

During development, asynchronous Firestore loading could finish after the Fabric.js canvas had already been disposed.

This resulted in errors caused by trying to interact with a canvas that no longer existed.

An `isDisposed` check was added so that asynchronous operations stop updating the canvas after the component has been unmounted.

---

### 4. Loading and error UI

The loading and error elements were initially placed inside the area managed by Fabric.js.

This caused problems because Fabric.js manages the canvas element and its surrounding rendering behavior.

The UI was separated from the Fabric.js-managed canvas so that Fabric.js only handles the actual canvas.

---

### 5. Vercel build

The first production deployment exposed missing runtime dependencies in `package.json`.

After adding the required dependencies, the project was successfully built locally using:

```bash
npm run build
```

and then deployed again.

---

### 6. React Router and Vercel

The application uses client-side routing for URLs such as:

```text
/canvas/abc123
```

Refreshing such a URL initially resulted in a Vercel 404 because Vercel was looking for a server-side route.

A rewrite was added in `vercel.json` so that these routes are handled by the React application.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- Node.js
- npm
- A Firebase project
- Cloud Firestore enabled in the Firebase project

### 1. Clone the repository

```bash
git clone https://github.com/NamanBabbar2701/2D-Canvas-Editor.git
cd 2D-Canvas-Editor/canvas-editor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

The application uses Firebase Firestore for canvas persistence.

Firebase configuration is maintained in:

```text
src/firebase.js
```

Create a Firebase project, enable Cloud Firestore, and configure the application with your Firebase project details.

### 4. Start the development server

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

### 5. Create a production build

```bash
npm run build
```

---

## 🔥 Firebase Configuration

The application uses Cloud Firestore to store canvas documents.

The main Firestore collection used by the application is:

```text
canvases
```

Each newly created canvas receives a unique Firestore document ID.

That ID is then used in the route:

```text
/canvas/:canvasId
```


---

## 🌐 Live Demo

The application is deployed on Vercel:

**[Open 2D Canvas Editor](https://2-d-canvas-editor-rho.vercel.app/)**

A simple way to test persistence:

```text
Create New Canvas
       ↓
Add / edit objects
       ↓
Click Save
       ↓
Refresh the page
       ↓
Saved canvas is restored
```

---

## 📸 Screenshots

Screenshots can be added here as the project documentation is finalized.

### Home Page

![Home Page](./canvas_editor.png)

### Canvas Editor

_Add a screenshot of the editor here._

### Saved Canvas

_Add a screenshot showing a saved canvas after refreshing the page._

---

## 📌 Project Status

**Completed**

The required functionality for the assignment has been implemented, tested, and deployed.

The current scope focuses on the core canvas editing and persistence experience. Advanced editor features such as undo/redo, layers, copy/paste, and similar functionality are outside the current scope.

---

## 👨‍💻 Author

**Naman Babbar**

[GitHub](https://github.com/NamanBabbar2701)