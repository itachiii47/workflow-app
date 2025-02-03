"use client";
import DraggableSidebar from "@/components/DraggableSidebar";
import WorkflowCanvas from "@/components/WorkflowCanvas";
import React from "react";
import { DndProvider } from "react-dnd";
import { ReactFlowProvider } from "reactflow";
import { HTML5Backend } from "react-dnd-html5-backend";

const Home: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <DraggableSidebar />
        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>
      </div>
    </DndProvider>
  );
};

export default Home;
