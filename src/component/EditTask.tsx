import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Task = {
    id: number;
    title: string;
    description: string;
    date: string;
    status: 'In Progress' | 'Pending' | 'Completed';
};

const EditTask = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ get task from location.state
    const taskList = location.state;
    const task = taskList.task;
    console.log("task --> " + JSON.stringify(task));

    // ✅ Use state variables (NOT the original task object)
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [status, setStatus] = useState<Task['status']>(task?.status || "Pending");

    const handleUpdate = () => {
        if (!task?.id) return;

        const updatedTask: Task = {
            ...task,
            title,
            description,
            status,
            date: new Date().toDateString(),
        };

        const stored = JSON.parse(localStorage.getItem('tasks') || '{}');

        // Remove from all categories
        ['inProgress', 'pending', 'completed'].forEach((key) => {
            stored[key] = (stored[key] || []).filter((t: Task) => t.id !== task.id);
        });

        // Push updated
        const newKey = status.toLowerCase().replace(' ', '');
        if (!Array.isArray(stored[newKey])) stored[newKey] = [];
        stored[newKey].push(updatedTask);

        // Save
        localStorage.setItem('tasks', JSON.stringify(stored));

        // Navigate back home
        navigate('/');
    };

    return (
        <div>

            <div className="task-header">

                <h2>Edit Task</h2>
            </div>
            <div className='task-container' style={{ marginTop: '15px' }}>
                <input
                    value={title}  // ✅ FIXED
                    onChange={(e) => setTitle(e.target.value)}

                    style={{ width: '80%', padding: 10, marginBottom: 10 }}
                />
                <textarea
                    value={description}  // ✅ FIXED
                    onChange={(e) => setDescription(e.target.value)}

                    style={{ width: '80%', padding: 10, marginBottom: 10 }}
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Task['status'])}
                    style={{ width: '80%', padding: 10, marginBottom: 10 }}
                >
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
                <div style={{ marginTop: 20 }}>
                    <button onClick={() => navigate(-1)} className='cancel-btn' style={{ marginRight: '25px' }}>
                        Cancel
                    </button>
                    <button onClick={handleUpdate} className='add-btn'>
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTask;
