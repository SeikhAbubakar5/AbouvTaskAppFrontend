import React, { useState, useEffect } from "react";
import "./Modalform.css"
const Modalform = ({ onSaveTask, onCancel, task }) => {
    const [formTask, setFormTask] = useState({
        title: "",
        description: "",
        status: "Pending",
    });

    useEffect(() => {
        if (task) {
            setFormTask(task);
        }
    }, [task]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formTask.title.trim()) {
            alert("Task title cannot be empty");
            return;
        }
        onSaveTask(formTask);
        setFormTask({ title: "", description: "", status: "Pending" });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={formTask.title}
                onChange={handleFormChange}
                required
            />
            <input
                type="text"
                name="description"
                placeholder="Description"
                value={formTask.description}
                onChange={handleFormChange}
                required
            />
            <select name="status" value={formTask.status} onChange={handleFormChange}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
            </select>
            <div className="modalButton">
                <button type="submit"
                style={{width:'100px',
                    height:'40px',
                     background:'blue',
                     textAlign:'center',
                     border:'none',borderRadius:'5px',
                     cursor:"pointer"}}>Save Task</button>

                <button type="button" onClick={onCancel}
                style={{width:'100px',
                    height:'40px',
                     background:'gray',
                     textAlign:'center',
                     border:'none',borderRadius:'5px',
                     cursor:"pointer"}}>Cancel</button>
            </div>
        </form>
    );
};

export default Modalform;