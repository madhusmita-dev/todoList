import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Task } from "../Type";

export default function TaskList() {
    const [openSection, setOpenSection] = useState("inprogress");
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<{
        inProgress: Task[];
        pending: Task[];
        completed: Task[];
    }>({
        inProgress: [],
        pending: [],
        completed: [],
    });
    useEffect(() => {
        const loadTasks = () => {
            try {
                const stored = JSON.parse(localStorage.getItem('tasks') || '{}') || {};
                setTasks({
                    inProgress: Array.isArray(stored.inProgress) ? stored.inProgress : [],
                    pending: Array.isArray(stored.pending) ? stored.pending : [],
                    completed: Array.isArray(stored.completed) ? stored.completed : [],
                });
            } catch (e) {
                console.error('Failed to load tasks:', e);
            }
        };

        loadTasks();
    }, []);
    console.log("tasks" + JSON.stringify(tasks))


    const toggleSection = (section: any) => {
        setOpenSection(openSection === section ? null : section);
    };

    const editTask = (task: Task) => {
        // Navigate to edit page and pass the task (or ID)
        navigate(`/edit/${task.id}`, { state: { task } });
        console.log("task" + JSON.stringify(task))
    };
    const filterTasks = (taskList: Task[]) => {
        if (!searchQuery.trim()) return taskList;

        return taskList.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };
    const deleteTask = (id: number, status: Task['status']) => {
        const updated = { ...tasks };

        // ✅ Map status string to actual object key
        const keyMap: Record<Task['status'], keyof typeof tasks> = {
            'In Progress': 'inProgress',
            'Pending': 'pending',
            'Completed': 'completed',
        };

        const key = keyMap[status];

        console.log('Trying to delete from:', key);
        console.log('Current tasks:', tasks);
        console.log('Tasks in this section:', updated[key]);


        if (!Array.isArray(updated[key])) {
            console.error(`No task list found for status: ${status}`);
            return;
        }


        updated[key] = updated[key].filter((task) => task.id !== id);


        localStorage.setItem('tasks', JSON.stringify(updated));
        setTasks(updated);

        console.log(`Deleted task with ID ${id} from ${status}`);
    };
    return (
        <div>
            {/* Header */}
            <div className="task-header">

                <h2>Add Task</h2>
            </div>
            <div className="task-container">
                {/* Search */}
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '50%',
                            padding: '10px',
                            margin: '10px 0',
                            fontSize: '16px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>

                {/* Sections */}
                <div className="section" style={{ marginBottom: '15px' }}>
                    <div className="section-header" onClick={() => toggleSection("inProgress")}>
                        <div style={{ marginBottom: '15px', width: '50%', textAlign: 'left' }}>
                            In Progress <span>({tasks.inProgress.length})</span>
                        </div>
                        <div style={{ width: '50%', textAlign: 'right' }}>
                            <span className="arrow">{openSection === "inProgress" ? "▲" : "▼"}</span>
                        </div>
                    </div>

                    {openSection === "inProgress" && filterTasks(tasks.inProgress).map((item, index) => {
                        return (
                            <div className="task-card" key={item.id}>
                                <div className="avatar">{item.title[0]}</div>
                                <div className="task-info">
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                    <small>{item.date}</small>
                                </div>
                                <div className='flex-row'>
                                    <div className="task-status">
                                        <span className={`dot ${item.status.toLowerCase().replace(" ", "-")}`}></span>
                                        {item.status}
                                    </div>

                                    <div style={{ marginTop: '15px' }}>
                                        <button onClick={() => editTask(item)} style={{ marginRight: '5px' }}>✏️</button>
                                        <button onClick={() => deleteTask(item.id, item.status)}>🗑️</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>


                {/* <div className="section-header" onClick={() => toggleSection("pending")} style={{ marginBottom: '15px' }}>
                        <div style={{ marginBottom: '15px', width: '50%', textAlign: 'left' }}>
                        Pending <span>({tasks.pending.length})</span>
                        <span className="arrow">{openSection === "pending" ? "▲" : "▼"}</span>
                    </div> */}


                <div className="section" style={{ marginBottom: '15px' }}>
                    <div className="section-header" onClick={() => toggleSection("pending")}>
                        <div style={{ marginBottom: '15px', width: '50%', textAlign: 'left' }}>
                            Pending <span>({tasks.pending.length})</span>
                        </div>
                        <div style={{ width: '50%', textAlign: 'right' }}>
                            <span className="arrow">{openSection === "inProgress" ? "▲" : "▼"}</span>
                        </div>
                    </div>

                    {openSection === "pending" && filterTasks(tasks.pending).map((item, index) => {
                        return (
                            <div className="task-card" key={item.id}>
                                <div className="avatar">{item.title[0]}</div>
                                <div className="task-info">
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                    <small>{item.date}</small>
                                </div>
                                <div className='flex-row'>
                                    <div className="task-status">
                                        <span className={`dot ${item.status.toLowerCase().replace(" ", "-")}`}></span>
                                        {item.status}
                                    </div>

                                    <div style={{ marginTop: '15px' }}>
                                        <button onClick={() => editTask(item)} style={{ marginRight: '5px' }}>✏️</button>
                                        <button onClick={() => deleteTask(item.id, 'In Progress')}>🗑️</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>


                {/* Completed */}
                {/* <div className="section" style={{ margin: '15px' }}>
                    <div className="section-header" onClick={() => toggleSection("completed")} style={{ marginBottom: '15px' }}>
                        Completed <span>({tasks.completed.length})</span>
                        <span className="arrow">{openSection === "completed" ? "▲" : "▼"}</span>
                    </div> */}


                    <div className="section" style={{ marginBottom: '15px' }}>
                    <div className="section-header" onClick={() => toggleSection("completed")}>
                        <div style={{ marginBottom: '15px', width: '50%', textAlign: 'left' }}>
                            completed <span>({tasks.completed.length})</span>
                        </div>
                        <div style={{ width: '50%', textAlign: 'right' }}>
                            <span className="arrow">{openSection === "inProgress" ? "▲" : "▼"}</span>
                        </div>
                    </div>
                    {openSection === "completed" && filterTasks(tasks.completed).map((item, index) => {
                        return (
                            <div className="task-card" key={item.id}>
                                <div className="avatar">{item.title[0]}</div>
                                <div className="task-info">
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                    <small>{item.date}</small>
                                </div>
                                <div className='flex-row'>
                                    <div className="task-status">
                                        <span className={`dot ${item.status.toLowerCase().replace(" ", "-")}`}></span>
                                        {item.status}
                                    </div>

                                    <div style={{ marginTop: '15px' }}>
                                        <button onClick={() => editTask(item)} style={{ marginRight: '5px' }}>✏️</button>
                                        <button onClick={() => deleteTask(item.id, 'In Progress')}>🗑️</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
            <button
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    fontSize: 24,
                    borderRadius: '50%',
                    width: 50,
                    height: 50,
                    backgroundColor: '#0056d2',
                    color: '#fff',
                    border: 'none',
                }}
                onClick={() => navigate('/add')}
            >
                +
            </button>
        </div>
    );
}
