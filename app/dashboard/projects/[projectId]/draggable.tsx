
"use client"
import { useDraggable } from "@dnd-kit/core";
import React from "react";
import { CSS } from "@dnd-kit/utilities";

function Draggable({
  children,
  data,
  id,
}: {
  children: React.ReactNode;
  data?: any;
  id: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    data,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 999 : "auto",
    
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      suppressHydrationWarning
      className={`w-full relative flex items-center justify-center rounded-md" ${isDragging ? "cursor-grabbing z-100" : "cursor-grab"}`}
    >
      {children}
    </div>
  );
}

export default Draggable;
