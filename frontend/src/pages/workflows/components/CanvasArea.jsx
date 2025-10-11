import React, { useState, useRef, useCallback, useEffect } from "react";
import { useWorkflowStore } from "@/store/WorkflowStore";
import DraggableNode from "./DraggableNode";
import ConnectionLine from "./ConnectionLine";
import { MessageSquare, ZoomIn, Mouse, Hand } from "lucide-react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function CanvasArea() {
  const { nodes, connections, zoom, pan, setPan, selectNode, setZoom } =
    useWorkflowStore();
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const [showGrid, setShowGrid] = useState(true);

  // minimap: hidden by default; show only while 'm' key is held
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [canvasRect, setCanvasRect] = useState({ width: window.innerWidth, height: window.innerHeight });

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isPanning) return;
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    },
    [isPanning, panStart, setPan]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  const handleWheel = useCallback(
    (e) => {
      // allow Ctrl+Scroll for zoom; don't prevent default unless ctrl pressed
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newZoom = Math.max(0.2, Math.min(zoom + delta, 2)); // Limit zoom
      setZoom(newZoom);
    },
    [zoom, setZoom]
  );

  // Keyboard shortcuts + minimap hold behavior
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey) {
        if (e.key === "0") {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }
      }
      if (e.key === "g") {
        setShowGrid((prev) => !prev);
      }
      // show minimap while holding "m"
      if (e.key === "m" || e.key === "M") {
        setShowMiniMap(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "m" || e.key === "M") {
        setShowMiniMap(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setPan, setZoom]);

  // keep canvas size for responsive minimap calculations
  useEffect(() => {
    const updateRect = () => {
      if (!canvasRef.current) return;
      const r = canvasRef.current.getBoundingClientRect();
      setCanvasRect({ width: r.width, height: r.height });
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={canvasRef}
        className="absolute inset-0 overflow-hidden bg-white"
        style={{
          cursor: isPanning ? "grabbing" : "grab",
          // ensure canvas fills available area and doesn't overflow
          minHeight: "calc(100vh - 0px)",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Background Grid */}
        <div
          className="canvas-background absolute inset-0 transition-colors"
          style={{
            backgroundImage: showGrid
              ? `radial-gradient(circle, rgba(156,163,175,0.9) 1px, transparent 1px)`
              : "none",
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
            backgroundColor: "#fafafa",
            transition: "background-size 0.15s linear, background-position 0.15s linear",
          }}
        />

        {/* Zoomable Content */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: "100%",
            height: "100%",
            willChange: "transform",
          }}
        >
          {/* Connections (SVG) - responsive */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              width: "100%",
              height: "100%",
              overflow: "visible",
              zIndex: 1,
            }}
            preserveAspectRatio="xMinYMin slice"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
              </marker>

              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {connections.map((connection) => (
              <ConnectionLine
                key={connection.id}
                connection={connection}
                nodes={nodes}
              />
            ))}
          </svg>

          {/* Draggable Nodes */}
          <div style={{ position: "relative", zIndex: 10, pointerEvents: "auto" }}>
            {nodes.map((node) => (
              <DraggableNode key={node.id} node={node} />
            ))}
          </div>

          {/* Empty State (when no nodes) */}
          {nodes.length === 0 && (
            <div
              className="absolute pointer-events-none select-none"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) scale(${1 / Math.max(zoom, 0.5)})`,
                transformOrigin: "center",
              }}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-dashed border-gray-300 p-10 max-w-lg">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageSquare className="w-10 h-10 text-blue-600" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Start Building Your Workflow
                  </h3>

                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Create powerful WhatsApp message flows with our visual editor.
                    <br />
                    Click on any message type in the toolbar to begin.
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                      <Hand className="w-4 h-4" />
                      <span>Drag canvas to pan</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mouse className="w-4 h-4" />
                      <span>Click nodes to select</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Ctrl</kbd>
                      <span>+ Scroll to zoom</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">M</kbd>
                      <span>Hold to view mini map</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mini Map - only visible while holding 'm' */}
        {nodes.length > 0 && showMiniMap && (
          <div
            className="absolute bottom-6 right-6 w-56 h-36 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border-2 border-gray-200 overflow-hidden"
            style={{ pointerEvents: "none" }}
          >
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 border-b border-gray-200">
              <span className="text-xs font-semibold text-gray-700">
                Mini Map (hold M to view)
              </span>
            </div>

            <div className="absolute inset-0 top-7">
              <div
                className="absolute"
                style={{
                  transform: `scale(${Math.max(0.04, Math.min(0.16, Math.min(200 / Math.max(canvasRect.width,1), 200 / Math.max(canvasRect.height,1))))})`,
                  transformOrigin: "0 0",
                }}
              >
                {nodes.map((node) => {
                  return (
                    <div
                      key={node.id}
                      className="bg-blue-500 rounded-full absolute pointer-events-none"
                      style={{
                        width: 10,
                        height: 10,
                        left: node.position?.x ?? 0,
                        top: node.position?.y ?? 0,
                      }}
                    />
                  );
                })}

                {/* Viewport Indicator */}
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
                  style={{
                    left: -pan.x / zoom,
                    top: -pan.y / zoom,
                    width: (canvasRect.width - 400) / Math.max(zoom, 0.1),
                    height: (canvasRect.height - 60) / Math.max(zoom, 0.1),
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none select-none">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-2">
              <ZoomIn className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-xs font-semibold text-gray-700">
                Zoom: {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded border-2 ${
                  showGrid
                    ? "bg-green-500 border-green-600"
                    : "bg-gray-300 border-gray-400"
                }`}
              />
              <span className="text-xs font-semibold text-gray-700">
                Grid: {showGrid ? "On" : "Off"}
              </span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-gray-200">
            <div className="text-xs font-mono text-gray-600">
              X: {Math.round(pan.x)} Y: {Math.round(pan.y)}
            </div>
          </div>
        </div>

      </div>
    </DndProvider>
  );
}
