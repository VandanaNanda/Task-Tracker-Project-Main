import { useContext, useEffect } from "react";
import { TaskStoreItems } from "../Store/Task-items-store";
import AddTask from "./AddTask";
import FlamedStreak from "./Streaks";
import { useLoaderData } from "react-router-dom";

function DisplayTasks() {
  const newTaskLoader = useLoaderData() || [];
  const { LoadTask } = useContext(TaskStoreItems)
  // Merging loaded tasks with existing tasks in context
  const { newTask } = useContext(TaskStoreItems);
  
  useEffect(() => {
    LoadTask(newTaskLoader)
    console.log(newTask)
  }, [])

  const { maximizedView, setMaximizedView } = useContext(TaskStoreItems);

  return (
    <div
      className="Display"
      onDoubleClick={() => {
        setMaximizedView(maximizedView ? "Block2" : "Block1");
      }}


    >
      <AddTask />
      {Array.isArray(newTask) && newTask.length !== 0 ? (
       
        newTask.map((task) => 
        
        <FlamedStreak key={task.id} task={task} />)
      ) : (
        <div>No tasks found</div>
      )}
    </div>
  );
}

export const TaskDataLoader = async () => {

  try {
    const response = await fetch("http://localhost:5000/api/get_task");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks from server");
    }
    const data = await response.json();
    data.filter((item, index, self) =>
      index !== self.findIndex(t => t.id === item.id))
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export default DisplayTasks;