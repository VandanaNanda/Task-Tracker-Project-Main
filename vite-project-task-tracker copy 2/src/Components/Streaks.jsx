import { useState, useContext, useEffect } from "react";
import { TaskStoreItems } from "../Store/Task-items-store";
import myImg from "../assets/flame.gif";
import goldenCover from "../assets/golden-wrapper.jpeg"

import Edit_Task from "./EditTask";

function FlamedStreak({ task }) {
  const { DeleteTask, EditTask } = useContext(TaskStoreItems);
  const [CurrComponent, setCurrComponent] = useState("Edit");
  const [EditedValue, setEditedValue] = useState("");
  const handleisDone = async (task) => {
    console.log(task.id)
   
    try {
      const res = await fetch(`http://localhost:5000/api/set_is_done/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 'is_done': true }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      console.log("data in is done",data)
      
      console.log("streak" ,task.id,task.streak,task.task,task.is_done)
    } catch (error) {
      console.error("Error:", error);
    }

  };
  const handleEditedValue = (val) => {
    setEditedValue(val);
  };
  const OnDelete = (task) => {
    fetch(`/api/delete_task/${task.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete task");
        }
        DeleteTask(task.id);

      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });


  };

  const OnSave = async (task) => {
    try {
      const res = await fetch(`http://localhost:5000/api/edit_task/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 'task': EditedValue }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      EditedValue.length !== 0 && EditTask(task.id, EditedValue);
      console.log("EditedValue",EditedValue)
      const data = await res.json();
      console.log(data)
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const OnHandleClick = () => {
    setCurrComponent(CurrComponent === "Edit" ? "Save" : "Edit");
    CurrComponent !== "Edit" && OnSave(task);
   console.log(CurrComponent)
  };

  return (
    <>
      <div className="Tasks">
        {CurrComponent === "Edit" ? (
          <p className="p-block">{task.task}</p>
        ) : (
          // issue of key
          <Edit_Task handleEditedValue={handleEditedValue} />
          //  set edit in editTask as dependency in useEffetct
        )}

        <div className="icons-block">
          <p>
            <img src={myImg} alt="flame" className="Img-flame" />
            <span className="yellow-color">{task.streak}</span>
          </p>
          {task.is_done === 0 ? <button
            type="button"
            className="btn btn-success"
            onClick={()=>{handleisDone(task)}}
          >
            Done
          </button> : <button
            type="none"
            className="btn btn-danger"
            style={{
              cursor: 'default', backgroundColor: 'gold', border: 'gold', color: 'black', backgroundImage: `url(${goldenCover})`,
              backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}

          >
            Done
          </button>}

          <button
            type="button"
            className="btn btn-danger"
            onClick={OnHandleClick}
          >
            {CurrComponent}
          </button>

          <button type="button" className="btn btn-danger" onClick={() => OnDelete(task)}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
}



export default FlamedStreak;
