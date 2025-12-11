import { act, createContext, useReducer, useState } from "react";

export const TaskStoreItems = createContext({
  newTask: [],
  AddNewTask: () => { },
  DeleteTask: () => { },
  EditTask: () => { },
});

const TaskReducer = (current_Tasks, action) => {
  switch (action.type) {
    case "ADD": {
      return [...current_Tasks, action.payload];
    }
    case "DEL": {
      return current_Tasks.filter((item) => item.id !== action.payload);
    }
    case "EDIT_TASK": {
      current_Tasks.map((item) =>
        item.id === action.payload.id
          ? item.task = action.payload.newValue
          : item.task
      );
      return current_Tasks;
    }
    case "LOAD_TASK": {

      return action.payload
    }

    default:
      return current_Tasks;
  }
};

const TaskStoreItemsProvider = ({ children }) => {
  const [maximizedView, setMaximizedView] = useState("Block1");
  const [newTask, dispatchTask] = useReducer(TaskReducer, []);

  const AddNewTask = (task) => {

    dispatchTask({
      type: "ADD",
      payload: task,
    });
  };
  const DeleteTask = (id) => {

    dispatchTask({ type: "DEL", payload: id });
  };
  const EditTask = (id, newValue) => {

    dispatchTask({ type: "EDIT_TASK", payload: { id, newValue } });
  };

  const LoadTask = (tasklist) => {

    dispatchTask({ type: "LOAD_TASK", payload: tasklist })
  }


  return (
    <TaskStoreItems.Provider
      value={{ maximizedView, setMaximizedView, newTask, AddNewTask, DeleteTask, EditTask, LoadTask }}
    >
      {children}
    </TaskStoreItems.Provider>
  );
};

export default TaskStoreItemsProvider;
// case "LOAD_TASKS": {
//   return action.payload; // Assuming payload is the array of tasks fetched from the server
// }
// const LoadTasks = (tasks) => {
//   dispatchTask({ type: "LOAD_TASKS", payload: tasks });
// }
// const EditDescription = (task) =>{
//   dispatchTask({type:'EDIT_DESP',payload:task})
// }
// const AddDescription = (task) => {
//   dispatchTask({type:"ADD",payload:task})
// };
// const EditPriority = (task) =>{
//   dispatchTask({type:'EDIT_PR',payload:task})
// }
// const DoneTask = (task) =>{
//   dispatchTask({type:'DONE',payload:task})
// }

// useReducer(reducerFunction, initialState)
// -----------------------------------------
// reducerFunction = pure function takes 2 paramenter(current state, action) and returns new state based on action.type
// initialState = initial value of the state
// Reducer Function
// let newTask = current_Tasks;