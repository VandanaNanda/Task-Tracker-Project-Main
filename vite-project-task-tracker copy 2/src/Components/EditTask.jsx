import { useRef, useState } from "react";

function Edit_Task({handleEditedValue}) {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    const newTaskValue = e.target.value;
    setInputValue(newTaskValue);    
    handleEditedValue(newTaskValue);
    
  };

  return (
    <>
      <div className="input-box">
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          type="text"
          // className="form-control "
          // id="floatingInput"
          style={{
            border: 'none',
            height: 'min-content',
            padding: '0',
            margin: '0',
            fontSize: '0.8rem',   
            width: '300px',      
            outline: 'none',
          }}
          placeholder="Enter new Task"
        />
      </div>
    </>
  );
}
// Blank IT for a whitle
export default Edit_Task;
