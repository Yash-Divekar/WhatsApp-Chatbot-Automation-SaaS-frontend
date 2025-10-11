import React, { useRef, useEffect, useCallback } from "react";
import { useWorkflowStore } from "@/store/WorkflowStore";
import MessageNode from "./MessageNode";

/**
 * DraggableNode
 * - Renders node at absolute position using transform (no layout thrash)
 * - Uses pointer events + requestAnimationFrame for smooth dragging
 * - Persists final position to store on pointerup
 */
export default function DraggableNode({ node }) {
  const updateNodePosition = useWorkflowStore((s) => s.updateNodePosition);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const setConnecting = useWorkflowStore((s) => s.startConnection);
  const finishConnection = useWorkflowStore((s) => s.finishConnection);

  const elRef = useRef(null);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef(null);
  const startRef = useRef({ sx: 0, sy: 0, nx: 0, ny: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    // initialize transform based on node.position
    el.style.transform = `translate(${node.position?.x || 0}px, ${node.position?.y || 0}px)`;
  }, [node.position]);

  const persistPosition = useCallback((x, y) => {
    updateNodePosition(node.id, { x: Math.round(x), y: Math.round(y) });
  }, [node.id, updateNodePosition]);

  const onPointerMove = useCallback((e) => {
    if (!draggingRef.current || pointerIdRef.current !== e.pointerId) return;
    const nx = e.clientX - startRef.current.sx + startRef.current.nx;
    const ny = e.clientY - startRef.current.sy + startRef.current.ny;
    // update transform via RAF for smoothness
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (elRef.current) elRef.current.style.transform = `translate(${nx}px, ${ny}px)`;
    });
    // store last in startRef for when pointerup persists
    startRef.current.lastX = nx;
    startRef.current.lastY = ny;
  }, []);

  const onPointerUp = useCallback((e) => {
    if (!draggingRef.current || pointerIdRef.current !== e.pointerId) return;
    draggingRef.current = false;
    pointerIdRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const finalX = startRef.current.lastX ?? (startRef.current.nx);
    const finalY = startRef.current.lastY ?? (startRef.current.ny);
    persistPosition(finalX, finalY);
    // restore pointer capture
    try { e.target.releasePointerCapture(e.pointerId); } catch (err) {}
  }, [persistPosition]);

  const onPointerDown = useCallback((e) => {
    // left button only
    if (e.button !== 0) return;
    draggingRef.current = true;
    pointerIdRef.current = e.pointerId;
    startRef.current.sx = e.clientX;
    startRef.current.sy = e.clientY;
    startRef.current.nx = node.position?.x || 0;
    startRef.current.ny = node.position?.y || 0;
    startRef.current.lastX = startRef.current.nx;
    startRef.current.lastY = startRef.current.ny;
    const target = e.currentTarget;
    try { target.setPointerCapture(e.pointerId); } catch (err) {}
  }, [node.position]);

  // click handler: if connectingFrom exists then finish connection; else select node
  const connectingFrom = useWorkflowStore((s) => s.connectingFrom);
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (connectingFrom) {
      // finish connection to this node
      finishConnection(node.id);
      return;
    }
    selectNode(node.id);
  }, [connectingFrom, finishConnection, node.id, selectNode]);

  return (
    <div
      ref={elRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={handleClick}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        touchAction: "none", // allow smooth dragging on touch
        zIndex: node.isSelected ? 50 : 10,
        // width controlled inside MessageNode (w-64)
      }}
    >
      <MessageNode node={node} />
    </div>
  );
}