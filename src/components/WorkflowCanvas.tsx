import React, { useEffect, useState, useMemo } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  useReactFlow,
  Background,
  MiniMap,
  Node,
  Edge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDrop } from "react-dnd";
import DownloadWorkflow from "./DownloadWorkflow";

// Initial nodes and edges
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const WorkflowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null); // Track selected node
  const reactFlowInstance = useReactFlow();

  const nodeTypes = useMemo(() => ({}), []);
  const edgeTypes = useMemo(() => ({}), []);

  // Handle node connections
  const handleConnect = (params: Connection) => {
    const newEdge = {
      ...params,
      animated: true,
      style: {
        stroke: "#00bfff",
        strokeWidth: 2,
        strokeDasharray: "5,5",
        // animation: "flow 1.5s infinite linear",
      },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  };

  // Handle node deletion
  const handleDelete = () => {
    if (selectedNode) {
  
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setSelectedNode(null); // Reset selected node
    }
  };

  // Persisting workflow state to localStorage
  useEffect(() => {
    const savedNodes = localStorage.getItem("nodes");
    const savedEdges = localStorage.getItem("edges");

    if (savedNodes && savedEdges) {
      setNodes(JSON.parse(savedNodes));
      setEdges(JSON.parse(savedEdges));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
  }, [nodes, edges]);

  // Handle node drop on canvas
  const handleNodeDrop = (
    item: { type: string; id: string; label: string },
    monitor: any
  ) => {
    const clientOffset = monitor.getClientOffset();
    if (!clientOffset) return;
    const position = reactFlowInstance.screenToFlowPosition(clientOffset); 

    const newNode = {
      id: `task${nodes.length + 1}`,
      type: "default",
      position,
      data: { label: item.label },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Set up the drop target to allow dropping nodes
  const [{ isOver }, drop] = useDrop({
    accept: "taskNode", 
    drop: (item, monitor) => handleNodeDrop(item, monitor), 
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Handle node selection
  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node); // Set selected node when a node is clicked
  };

  return (
    <div
      className="flex-1 h-full bg-gray-100"
      ref={drop} // Attach the drop ref here
      style={{ position: "relative", minHeight: "100vh" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick} // Capture node click to select the node
        fitView
        snapToGrid={true}
        deleteKeyCode={46} // For delete node with delete key
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        style={{ backgroundColor: "#F7F9FB" }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {/* Pass nodes and edges to the DownloadWorkflow component */}
      {nodes.length > 0 && edges.length > 0 ? (
        <DownloadWorkflow nodes={nodes} edges={edges} />
      ) : null}

      {/* Delete button to remove the selected node */}
      {selectedNode ? (
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          {`Delete ${selectedNode.data.label}`}
        </button>
      ) : null}
    </div>
  );
};

export default WorkflowCanvas;
