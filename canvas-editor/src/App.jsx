import "./App.css";

function App(){
  return(
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

        <button className="create-button">
          + Create New Canvas
        </button>
      </main>
    </div>
  )
}

export default App;