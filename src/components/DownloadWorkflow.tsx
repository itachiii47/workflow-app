import React from "react";

// Function to download the workflow as JSON
const downloadWorkflow = (nodes: any[], edges: any[]) => {
  const workflowData = JSON.stringify({ nodes, edges }, null, 2);
  const blob = new Blob([workflowData], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "workflow.json"; // Set the filename for the downloaded file
  link.click();
};

interface DownloadWorkflowProps {
  nodes: any[];
  edges: any[];
}

const DownloadWorkflow: React.FC<DownloadWorkflowProps> = ({
  nodes,
  edges,
}) => {
  const handleDownload = () => {
    downloadWorkflow(nodes, edges);
  };

  return (
    <button
      onClick={handleDownload}
      className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded"
    >
      Download Workflow
    </button>
  );
};

export default DownloadWorkflow;
