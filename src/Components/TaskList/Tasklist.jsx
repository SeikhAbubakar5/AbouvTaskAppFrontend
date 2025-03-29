import React, { useState, useEffect } from "react";
import Task from "../Task/Task";
import Modalform from "../Modalform/Modalform";
import "./Tasklist.css";
import ReactModal from "react-modal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

ReactModal.setAppElement("#root");

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, user not authenticated");
      toast.error("Unauthorized! Please log in.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/task/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks.");
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/task/update/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleSaveTask = async (task) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Session expired, please login again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const method = editTask ? "PUT" : "POST";
      const url = editTask
        ? `${API_BASE_URL}/task/update/${editTask._id}`
        : `${API_BASE_URL}/task/create`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Unauthorized! Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to save task.");
        }
        return;
      }

      toast.success("Task saved successfully!");
      setShowForm(false);
      setEditTask(null);
      await fetchTasks();
    } catch (error) {
      console.error("Failed to save task:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/task/delete/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const openForm = (task = null) => {
    setEditTask(task);
    setShowForm(true);
  };

  return (
    <div className="container">
      <div className="Navbar">
        <h2 style={{ color: "white" }}>Task Management</h2>
        <button onClick={() => openForm()}>
          {showForm ? "Close Form" : "Create Task"}
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <ReactModal
        isOpen={showForm}
        onRequestClose={() => setShowForm(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <Modalform
          onSaveTask={handleSaveTask}
          onCancel={() => setShowForm(false)}
          task={editTask}
        />
      </ReactModal>

      <div className="progressTask">
        <h3>In Progress Tasks</h3>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks
              .filter((task) => task.status !== "Completed")
              .map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onUpdateStatus={handleUpdateStatus}
                  onEdit={() => openForm(task)}
                  onDelete={handleDeleteTask}
                />
              ))}
          </tbody>
        </table>
      </div>

      <div className="completedTask">
        <h3>Completed Tasks</h3>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks
              .filter((task) => task.status === "Completed")
              .map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onEdit={() => openForm(task)}
                  onDelete={handleDeleteTask}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
