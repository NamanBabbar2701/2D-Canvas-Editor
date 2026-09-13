import { useEffect, useRef} from "react";
import {
  ActiveSelection,
  Circle,
  Canvas as FabricCanvas,
  IText,
  PencilBrush,
  Rect,
} from "fabric";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import "./Canvas.css";

function Canvas() {
  const { canvasId } = useParams();

  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    let isDisposed = false;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1000,
      height: 600,
      backgroundColor: "#ffffff",
    });

    fabricCanvasRef.current = canvas;

    const loadCanvas = async () => {
      try {
        const canvasDoc = await getDoc(doc(db, "canvases", canvasId));

        if (isDisposed) return;

        if (!canvasDoc.exists()) {
          console.error("Canvas not found");
          return;
        }

        if (isDisposed) return;

        const data = canvasDoc.data();

        if (!data.data) {
          console.log("No saved canvas data found");
          return;
        }

        const canvasData = JSON.parse(data.data);

        if(isDisposed) return;
        
        await canvas.loadFromJSON(canvasData);
        
        if(isDisposed) return;
        
        canvas.renderAll();

        console.log("Canvas loaded successfully");
      } catch (error) {
        if(!isDisposed){
            console.error("Error loading canvas:", error);
        }        
      }
    };

    loadCanvas();

    const handleKeyDown = (event) => {
      //Select all objects
      if (event.ctrlKey && event.key.toLowerCase() === "a") {
        event.preventDefault();

        const objects = canvas.getObjects();

        if (objects.length > 0) {
          const selection = new ActiveSelection(objects, {
            canvas: canvas,
          });

          canvas.setActiveObject(selection);
          canvas.renderAll();
        }

        return;
      }

      //Delete selected Objects

      if (event.key === "Delete") {
        const activeObjects = canvas.getActiveObjects();

        if (activeObjects.length > 0) {
          activeObjects.forEach((object) => {
            canvas.remove(object);
          });

          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }

      //Ctrl+S to save the Canvas
      // if(event.ctrlKey && event.key.toLowerCase() === "s"){
      //     event.preventDefault();

      // }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
        isDisposed = true;

        window.removeEventListener("keydown", handleKeyDown);
      
        canvas.dispose();
    };
  }, [canvasId]);

  const addRectangle = () => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    const rectangle = new Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 100,
      fill: "#6366f1",
    });

    canvas.add(rectangle);
    canvas.setActiveObject(rectangle);
    canvas.renderAll();
  };

  const addCircle = () => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    const circle = new Circle({
      left: 300,
      top: 100,
      radius: 60,
      fill: "#22c55e",
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addText = () => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    const text = new IText("Double Click to edit", {
      left: 500,
      top: 100,
      fontSize: 24,
      fill: "#0f172a",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const togglePen = () => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
    }

    canvas.isDrawingMode = !canvas.isDrawingMode;

    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.width = 5;
    }
  };

  const changeColor = (color) => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      if (activeObject.type === "path") {
        activeObject.set({
          stroke: color,
        });
      } else {
        activeObject.set({
          fill: color,
        });
      }
    }

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }

    canvas.requestRenderAll();
  };

  const saveCanvas = async () => {
    const canvas = fabricCanvasRef.current;

    if (!canvas || !canvasId) return;

    try {
      // const canvasData = canvas.toJSON(); //Converting directly to JSON is producing undefined values which firestore is not allowing..
      const canvasData = JSON.stringify(canvas.toJSON());

      await updateDoc(doc(db, "canvases", canvasId), {
        data: canvasData,
        updatedAt: serverTimestamp(),
      });

      console.log("Canvas Saved Successfully");
    } catch (error) {
      console.error("Error saving canvas:", error);
    }
  };

  return (
    <div className="canvas-page">
      <div className="toolbar">
        <button onClick={addRectangle}>Rectangle</button>

        <button onClick={addCircle}>Circle</button>

        <button onClick={addText}>Text</button>

        <button onClick={togglePen}>Pen</button>

        <input
          type="color"
          onChange={(event) => changeColor(event.target.value)}
        />

        <button onClick={saveCanvas}>Save</button>
      </div>

      <div className="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default Canvas;
