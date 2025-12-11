import { useContext } from "react";
import { TaskStoreItems } from "./Store/Task-items-store";
import { Outlet } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Calender from "./Components/calender";
import TheGraph from "./Components/the_Graph";
import AIquotes from "./Components/AI_quotes"
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const { maximizedView, setMaximizedView } = useContext(TaskStoreItems);
  
  return (
     <>
    <NavBar></NavBar>
    <div
      className={`item-container ${
        maximizedView === "Block1" ? "a-is-max" : "b-is-max"
      }`}
    >
      <Outlet />
      <TheGraph
        className="yello para-block"
        maximizedView={maximizedView === "Block2"}
        setMaximizedView={setMaximizedView}
      ></TheGraph>

      <Calender></Calender>
    </div>
    {/* <AIquotes></AIquotes> */}

   </>
  );
}

export default App;