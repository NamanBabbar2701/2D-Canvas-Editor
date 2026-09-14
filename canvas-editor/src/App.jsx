import "./App.css";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Canvas from "./pages/Canvas.jsx"

function App(){
  return(
    <Routes>
      <Route path="/" element={<Home />}/>

      <Route path="/canvas/:canvasId" element={<Canvas />} />
    </Routes>
  )
}

export default App;