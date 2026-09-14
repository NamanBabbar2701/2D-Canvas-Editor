import { useNavigate } from "react-router-dom";
import { collection, addDoc} from "firebase/firestore";
import {db} from "../firebase";

function Home() {
    const navigate = useNavigate();

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
            </main>
          </div>
    );
}

export default Home;