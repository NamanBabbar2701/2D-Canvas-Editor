import "./App.css";
import {db} from "./firebase.js"
import { collection, addDoc } from "firebase/firestore";
import {Routes, Route, useNavigate} from "react-router-dom";
import Canvas from "./pages/Canvas.jsx"

function App(){

  const createNewCanvas = async () => {
      try{
        const canvasRef = await addDoc(collection(db, "canvases"), {
          name: "Untitled Canvas",
          createdAt: new Date(),
        });

        console.log("Canvas created: ", canvasRef.id);

        navigate(`/canvas/${canvasRef.id}`);
      }catch (error) {
        console.error("Error creating canvas:", error);
      }
  };

  const navigate = useNavigate();

  return(
    <Routes>
      <Route 
        path="/"
        element={
          <div className="home"> 
          {/* Navigation */}
            <nav className="navbar">
              <h2 className="logo">Canvas Editor</h2>
            </nav>

            {/* Hero Section */}
            <main className="hero">
              <h1>
                  Create. Draw. <span>Edit.</span>
              </h1>

              <p>
                A simple 2D canvas editor for creating and editing ideas.
              </p>

              <button className="create-button" onClick={createNewCanvas}>
                + Create New Canvas
              </button>
            </main>
          </div>
        }
      />

      <Route path="/canvas/:canvasId" element={<Canvas />} />
    </Routes>
  )
}

export default App;