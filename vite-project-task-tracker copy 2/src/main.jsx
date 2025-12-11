import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DisplayTasks, { TaskDataLoader } from "./Components/Tasks";
import App from "./App";
import "./App.css";
import TaskStoreItemsProvider from "./Store/Task-items-store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <DisplayTasks />,
        loader: TaskDataLoader,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TaskStoreItemsProvider>
      <RouterProvider router={router} />
    </TaskStoreItemsProvider>
  </React.StrictMode>
);