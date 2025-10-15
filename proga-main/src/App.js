import logo from './logo.svg';
import './App.css';
import EmployeeAPI from "./api/service";
import Table from "./Table";
import { useState } from "react";

function App() {
  const [employees, setEmployees] = useState(EmployeeAPI.all());пше
  const [name, setName] = useState("");
  const [job, setJob] = useState("");

  const handleDelete = (indexToRemove) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAdd = () => {
    if (name.trim() === "" || job.trim() === "") return;

    const newEmployee = { name, job };
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    setName("");
    setJob("");
  };

  return (
    <div className="App">
      <h2>Add Employee</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Job"
        value={job}
        onChange={(e) => setJob(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      <Table employees={employees} onDelete={handleDelete} />
    </div>
  );
}

export default App;
