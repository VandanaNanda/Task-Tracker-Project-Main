import { useRef, useContext } from "react";
import { TaskStoreItems } from "../Store/Task-items-store";
// to set it in loop 
function AddTask() {
  const inputRef = useRef(null); // why?
  const { AddNewTask } = useContext(TaskStoreItems);
  const { newTask } = useContext(TaskStoreItems);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const task = inputRef.current.value;
    if (task.length === 0) {
      alert("Task cannot be empty");
      return;
    }
    inputRef.current.value = "";

    try {

      const res = await fetch("/api/add_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: task }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
    } catch (error) {
      console.error("Error:", error);
    }

    try {
      const response = await fetch("http://localhost:5000/api/get_task");
      if (!response.ok) {
        throw new Error('Failed to fetch AddTask +');
      }
      const data = await response.json();
      const filteredData = data.filter(
        item => !newTask.some(j => j.task === item.task)
      );

      console.log(data)
      console.log(filteredData)
      if (filteredData.length !== 0 && filteredData[0].length !== 0) {
        console.log("there is ")
        AddNewTask(filteredData[0])
      }

      return data
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }

  };
  //
  return (
    <>
      <div className="input-box">
        <input
          ref={inputRef}
          type="text"
          className="form-control "
          id="floatingInput"
          placeholder="Enter new Task"
        />
        <button
          type="button"
          className="btn btn-success"
          onClick={handleAddTask}
        >
          Success
        </button>
      </div>
    </>
  );
}

export default AddTask;
