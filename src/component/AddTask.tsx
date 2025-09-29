import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Task } from "../Type";

export default function AddTask() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleAdd = () => {
        if (!title.trim() || !description.trim()) {
            alert("Please fill in both fields");
            return;
        }

        const newTask: Task = {
            id: Date.now(),
            title,
            description,
            date: new Date().toDateString(),
            status: "In Progress",
        };

        // ✅ Load existing tasks from localStorage
        const stored = JSON.parse(localStorage.getItem("tasks") || "{}") || {
            inProgress: [],
            pending: [],
            completed: [],
        };

        const updated = {
            ...stored,
            inProgress: [...(stored.inProgress || []), newTask],
        };

        // ✅ Save back to localStorage
        localStorage.setItem("tasks", JSON.stringify(updated));

        // ✅ Navigate back to task list
        navigate("/");
    };


    const handleCancel = () => {
        setTitle("");
        setDescription("");
    };

    return (
        <div className="">
            {/* Header */}
            <div className="task-header">
                <button className="back-btn" onClick={() => navigate('/')}>←</button>
                <h2>Add Task</h2>
            </div>
            <div className="task-container">
                {/* Form */}
                <div className="task-form">
                    <input
                        type="text"
                        placeholder="Enter the title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Enter the description"

                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>

                    {/* Buttons */}
                    <div className="task-buttons">
                        <button className="cancel-btn" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button className="add-btn" onClick={handleAdd}>
                            ADD
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
