import React from "react";
import { getBezierPath } from "reactflow";

export default function ConnectionLine({ connection, nodes }) {
  const sourceNode = nodes.find((node) => node.id === connection.from);
  const targetNode = nodes.find((node) => node.id === connection.to);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const sourcePosition = {
    x: sourceNode.position.x + sourceNode.width / 2,
    y: sourceNode.position.y + sourceNode.height / 2,
  };

  const targetPosition = {
    x: targetNode.position.x + targetNode.width / 2,
    y: targetNode.position.y + targetNode.height / 2,
  };

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sourcePosition.x,
    sourceY: sourcePosition.y,
    targetX: targetPosition.x,
    targetY: targetPosition.y,
  });

  return (
    <>
      <path
        id={connection.id}
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
        style={{ filter: "url(#glow)" }}
      />
      <text
        className="edgebutton-text text-blue-800 font-bold text-xs"
        x={labelX}
        y={labelY}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {connection.buttonId}
      </text>
    </>
  );
}