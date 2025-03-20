import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
}

const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=5";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = () => {
    if (taskTitle.trim() !== "") {
      const newTask: Task = { id: Date.now(), title: taskTitle };
      setTasks([...tasks, newTask]);
      setTaskTitle("");
    }
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setEditedTitle(task.title);
    setIsEditing(true);
  };

  const updateTask = () => {
    if (currentTask) {
      setTasks(
        tasks.map((task) =>
          task.id === currentTask.id ? { ...task, title: editedTitle } : task
        )
      );
      setIsEditing(false);
      setCurrentTask(null);
    }
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="task-container">
      <h1>To-Do List</h1>

      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span>{task.title}</span>
            <div>
              <button className="edit-btn" onClick={() => openEditModal(task)}>Edit</button>
              <button className="delete-btn" onClick={() => removeTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <button onClick={updateTask}>💾 Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
