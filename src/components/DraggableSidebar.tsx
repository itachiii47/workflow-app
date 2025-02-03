import React from "react";
import { useDrag } from "react-dnd";

const TASK_NODE_TYPE = "taskNode";

interface Task {
  id: string;
  label: string;
}

const tasks: Task[] = [
  { id: "task1", label: "Task 1" },
  { id: "task2", label: "Task 2" },
  { id: "task3", label: "Task 3" },
  { id: "task4", label: "Task 4" },
  { id: "task5", label: "Task 5" },
];

const DraggableSidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Workflow Nodes</h2>
      {tasks.map((task) => (
        <DraggableTaskNode key={task.id} task={task} />
      ))}
    </div>
  );
};

const DraggableTaskNode = ({ task }: { task: Task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: TASK_NODE_TYPE,
    item: { type: TASK_NODE_TYPE, id: task.id, label: task.label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-gray-700 p-4 rounded-lg cursor-pointer mb-4 hover:bg-gray-600 transition ${
        isDragging ? "opacity-50 scale-105" : "opacity-100"
      }`}
    >
      {task.label}
    </div>
  );
};

export default DraggableSidebar;
