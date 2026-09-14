import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc} from "firebase/firestore";
import {db} from "../firebase";

function Home() {
    const navigate = useNavigate();
    const [canvasInput, setCanvasInput] = useState("");

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

    const loadExistingCanvas = () => {
        const input = canvasInput.trim();

        if(!input) return;

        let canvasId = input;
        
        if(input.startsWith("http://") || input.startsWith("https://")) {
            const url = new URL(input);

            const pathParts = url.pathname.split("/").filter(Boolean);

            if(pathParts[0] === "canvas" && pathParts[1]) {
                canvasId = pathParts[1];
            }
        }

        navigate(`/canvas/${canvasId}`);
    };

    return (
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

              <div className="load-canvas">
                <div className="divider">
                    <span>or</span>
                </div>

                <input
                    type="text"
                    placeholder="Enter Canvas ID or URL"
                    value={canvasInput}
                    onChange={(event) => setCanvasInput(event.target.value)}
                    onKeyDown={(event) => {
                        if(event.key === "Enter") {
                            loadExistingCanvas();
                        }
                    }}
                />

                <button onClick={loadExistingCanvas}>
                    Load Existing Canvas
                </button>
              </div>
            </main>
          </div>
    );
}

export default Home;