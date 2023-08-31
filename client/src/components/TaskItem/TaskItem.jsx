import React, { useState, useEffect } from 'react';
import service from "../../api/apiHandler";

function TaskItem({ task, selected, onTaskUpdate, onTaskDelete, onTaskSelect }) {
  const [isEditing, setIsEditing] = useState(false);
  const [taskName, setTaskName] = useState(task.name);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [completed, setCompleted] = useState(task.completed);

  function handleTaskNameChange(event) {
    setTaskName(event.target.value);
  }

  function handleTaskDescriptionChange(event) {
    setTaskDescription(event.target.value);
  }

  function handleTaskUpdate() {
    onTaskUpdate({ ...task, name: taskName, description: taskDescription, completed: completed });
    setIsEditing(false);
  }

  function handleTaskDelete() {
    onTaskDelete(task);
  }

  function handleTaskSelect() {
    onTaskSelect(task);
  }

  function handleCheckboxChange(event) {
    setCompleted(event.target.checked);
    onTaskUpdate({ ...task, completed: event.target.checked });
  }

  return (
    <li style={{ textDecoration: task.completed ? 'line-through' : 'none', cursor: 'pointer' }} onClick={handleTaskSelect}>
      {isEditing ? (
        <>
          <input type="text" value={taskName} onChange={handleTaskNameChange} />
          <input type="text" value={taskDescription} onChange={handleTaskDescriptionChange} />
          <input type="checkbox" checked={completed} onChange={handleCheckboxChange} />
          <button onClick={handleTaskUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <input type="checkbox" checked={completed} onChange={handleCheckboxChange} />
          <span>{task.title}</span>
          {!task.completed && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleTaskDelete}>Delete</button>
            </>
          )}
        </>
      )}
    </li>
  );
}

export default TaskItem;