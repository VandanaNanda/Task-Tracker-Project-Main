import { useState } from "react";


function AIquotes() {
  const [newText, setnewText] = useState(null)
  const handleFetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get_remarks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks from server");
      }
      const data = await response.json();
      if (data !== null) {
        setnewText(data[0])
      }
      console.log(" AI data",data)
      return data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }
  return (
    <>
      <div className="alert alert-danger AI_alert" role="alert" onLoad={() => handleFetchData}>
      {newText}
      </div>
    </>
  );
}
export default AIquotes;
