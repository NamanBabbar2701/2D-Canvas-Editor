import { useEffect, useRef, useState } from "react";
import {
  ActiveSelection,
  Circle,
  Canvas as FabricCanvas,
  IText,
  PencilBrush,
  Rect,
} from "fabric";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import "./Canvas.css";

function Canvas() {
  const { canvasId } = useParams();
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const saveVersionRef = useRef(0);

  const [saveStatus, setSaveStatus] = useState("saved");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const markUnsaved = () => {
    saveVersionRef.current += 1;
    setSaveStatus("unsaved");
  };

    const saveCanvas = async () => {
    const canvas = fabricCanvasRef.current;

    if (!canvas || !canvasId) return;

    try {
      setSaveStatus("saving");

      const versionAtSave = saveVersionRef.current;
      // const canvasData = canvas.toJSON(); //Converting directly to JSON is producing undefined values which firestore is not allowing..
      const canvasData = JSON.stringify(canvas.toJSON());

      await updateDoc(doc(db, "canvases", canvasId), {
        data: canvasData,
        updatedAt: serverTimestamp(),
      });

      if(saveVersionRef.current === versionAtSave){
        setSaveStatus("saved");
      } else {
        setSaveStatus("unsaved");
      }

      console.log("Canvas Saved Successfully");
    } catch (error) {
      setSaveStatus("unsaved");

      console.error("Error saving canvas:", error);
    }
  };


  useEffect(() => {
    let isDisposed = false;
    let isLoadingCanvasData = true;

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

          isLoadingCanvasData = false;
          setLoadError("Canvas not found");
          setIsLoading(false);

          return;
        }

        if (isDisposed) return;

        const data = canvasDoc.data();

        if (!data.data) {
          isLoadingCanvasData = false;

          setSaveStatus("saved");
          setIsLoading(false);
          console.log("No saved canvas data found");
          return;
        }

        const canvasData = JSON.parse(data.data);

        if (isDisposed) return;

        await canvas.loadFromJSON(canvasData);

        if (isDisposed) return;

        canvas.renderAll();

        isLoadingCanvasData = false;
        setSaveStatus("saved");
        setIsLoading(false);

        console.log("Canvas loaded successfully");
      } catch (error) {
        if (!isDisposed) {
          console.error("Error loading canvas:", error);

          isLoadingCanvasData = false;
          setLoadError("Unable to load the canvas");
          setIsLoading(false);
        }
      }
    };

    loadCanvas();

    const handleCanvasChange = () => {
      if (!isLoadingCanvasData) {
        markUnsaved();
      }
    };

    canvas.on("object:modified", handleCanvasChange);
    canvas.on("text:changed", handleCanvasChange);

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

          markUnsaved();
        }
      }

      //Ctrl+S to save the Canvas
      if(event.ctrlKey && event.key.toLowerCase() === "s"){
          event.preventDefault();
          saveCanvas();

      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      isDisposed = true;

      window.removeEventListener("keydown", handleKeyDown);

      canvas.off("object:modified", handleCanvasChange);
      canvas.off("text:changed", handleCanvasChange);

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

    markUnsaved();
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

    markUnsaved();
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

    markUnsaved();
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

    markUnsaved();
  };


  

  return (
    <div className="canvas-page">
      {!loadError && (
        <div className="toolbar">
          <span className={`save-status ${saveStatus}`}>
            {saveStatus === "saved" && "Saved"}
            {saveStatus === "unsaved" && "Unsaved Changes"}
            {saveStatus === "saving" && "Saving..."}
          </span>
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
      )}

      <div className="editor-area">
        {isLoading && <div className="canvas-loading">Loading canvas...</div>}

        <div className="canvas-wrapper">
          <canvas ref={canvasRef} />
        </div>

        {loadError && (
          <div className="canvas-error">
            <h2>{loadError}</h2>

            <p>This canvas doesn't exist or could not be loaded.</p>

            <button onClick={() => navigate("/")}>Back to Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Canvas;
