import { useEffect, useRef} from "react";
import { Circle, Canvas as FabricCanvas, IText, PencilBrush, Rect } from "fabric";
import "./Canvas.css"

function Canvas() {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);

    useEffect(() => {
        const canvas = new FabricCanvas(canvasRef.current, {
            width: 1000,
            height: 600,
            backgroundColor: "#ffffff",
        });

        fabricCanvasRef.current = canvas;

        return () => {
            canvas.dispose();
        };
    }, []);

    const addRectangle = () => {
        const canvas = fabricCanvasRef.current;

        if(!canvas) return;

        const rectangle = new Rect({
            left: 100,
            top: 100,
            width: 150,
            height: 100,
            fill: '#6366f1'
        });
        
        canvas.add(rectangle);
        canvas.setActiveObject(rectangle);
        canvas.renderAll();
    }

    const addCircle = () => {
        const canvas = fabricCanvasRef.current;

        if(!canvas) return;

        const circle = new Circle({
            left: 300,
            top: 100,
            radius: 60,
            fill: "#22c55e"
        });

        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.renderAll();
    };

    const addText = () => {
        const canvas = fabricCanvasRef.current;

        if(!canvas) return;

        const text = new IText("Double Click to edit", {
            left: 500,
            top: 100,
            fontSize: 24,
            fill: "#0f172a"
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const togglePen = () => {
        const canvas = fabricCanvasRef.current;

        if(!canvas) return;

        if(!canvas.freeDrawingBrush){
            canvas.freeDrawingBrush = new PencilBrush(canvas);
        }

        canvas.isDrawingMode = !canvas.isDrawingMode;

        if(canvas.isDrawingMode) {
            canvas.freeDrawingBrush.width = 5;
            canvas.freeDrawingBrush.color = "#0f172a";
        }
    };

    return(
        <div className="canvas-page">
            <div className="toolbar">
                <button onClick={addRectangle}>
                    Rectangle
                </button>

                <button onClick={addCircle}>
                    Circle
                </button>

                <button onClick={addText}>
                    Text
                </button>

                <button onClick={togglePen}>
                    Pen
                </button>
            </div>

            <div className="canvas-wrapper">   
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}

export default Canvas;