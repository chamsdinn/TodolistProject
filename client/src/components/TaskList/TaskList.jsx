import React, { useState, useEffect } from 'react';
import TaskItem from '../TaskItem/TaskItem';
import service from "../../api/apiHandler";

function TaskList({ tasks, selectedTask, onTaskCreate, onTaskUpdate, onTaskDelete, onTaskSelect }) {
  const [newTaskName, setNewTaskName] = useState('');

  function handleTaskNameChange(event) {
    setNewTaskName(event.target.value);
  }

  function handleTaskCreate() {
    if (!newTaskName) return;
    onTaskCreate({ name: newTaskName, completed: false });
    setNewTaskName('');
  }

  function handleTaskUpdate(task) {
    onTaskUpdate(task);
  }

  function handleTaskDelete(task) {
    onTaskDelete(task);
  }

  function handleTaskSelect(task) {
    onTaskSelect(task);
  }

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            selected={selectedTask && task._id === selectedTask._id}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskSelect={handleTaskSelect}
          />
        ))}
      </ul>
      <div>
        <input type="text" value={newTaskName} onChange={handleTaskNameChange} />
        <button onClick={handleTaskCreate}>Add Task</button>
      </div>
    </div>
  );
}

export default TaskList;