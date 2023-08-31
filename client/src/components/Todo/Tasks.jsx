import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import DoneIcon from '@mui/icons-material/Done';
import axios from "axios";
import { Dialog, DialogContent,DialogTitle,Grid,Button,TextField,Box } from "@mui/material";

export const Task = ({ data , todoId , onTaskEdit}) => {
  const [tasks, setTasks] = useState(data || []);
  const [addValue, setAddValue] = useState('');
  const [actualTask, setActualTask] = useState('');
  const [open , setOpen] = useState(false);
  

  const addTask = async (task) => {
    const res = await axios.post("http://localhost:8080/api/me/task", {title: task , todoList : todoId},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    } )
    const newData= res.data;
    setTasks([...tasks, newData])
  }

  const deleteTodo = (id) =>{ 
    setTasks(tasks.filter((task) => task._id !== id))
    axios.delete(`http://localhost:8080/api/me/task/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    } )
  };
  const handleCompleted = async (id,completed)=>{
    await axios.put(`http://localhost:8080/api/me/task/${id}`, {completed : !completed},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    } )
    setTasks(tasks.map((task) =>
    task._id === id ? { ...task, completed: !task.completed } : task))
  }
  const editTask = (task) => {
    setActualTask(task)
    setOpen(true)
  }


  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (addValue) {
      addTask(addValue);
      setAddValue('');
    }
  }
  const handleEditClose = () => {
    setOpen(false);
  }
  useEffect(() => {
    setTasks(data);
  }, [data]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/me/task/${actualTask._id}`,
        {
          title: event.target.name.value,
          user: localStorage.getItem("id"),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      handleEditClose();
      onTaskEdit();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };
  

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done !</h1>
      <form onSubmit={handleAddSubmit} className="TodoForm">
        <input type="text" value={addValue} onChange={(e) => setAddValue(e.target.value)} className="task-input" placeholder='What is the task today?' />
        <button type="submit" className='task-btn'>Add Task</button>
      </form>
      {tasks.map((task) =>
        
          <div key={task._id} className="Task">
            <p className={`${task.completed ? 'completed' : ""}`} >{task.title}</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <DoneIcon sx={{mr:1}} onClick={()=>handleCompleted(task._id,task.completed)}/>
              <FontAwesomeIcon icon={faPenToSquare} onClick={() => editTask(task)} />
              <FontAwesomeIcon icon={faTrash} onClick={() => deleteTodo(task._id)} />
            </div>
          </div>
      )}
      <Dialog open={open} onClose={handleEditClose} fullWidth>
        <DialogTitle>editing task</DialogTitle>
        <form onSubmit={handleEditSubmit}>
        <DialogContent>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={4} md={3} justifyContent="flex-end" textAlign={{ sm: 'right' }}>
              <Box pr={3} sx={{ pt: 2 }} alignSelf="center">
                <b>Title</b>
              </Box>
            </Grid>
            <Grid sx={{ mb: 3 }} item xs={12} sm={8} md={9}>
              <TextField
                fullWidth
                name="name"
                placeholder="write your task title here"
                value={actualTask.title}
                onChange={(e) => setActualTask({ ...actualTask, title: e.target.value })}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12} textAlign="center"> 
            <Button sx={{ mr: 2 }} type="submit" variant="contained" size="large">
              Update Task
            </Button>
            <Button sx={{ pt: 1 }} color="secondary" size="large" variant="outlined" onClick={handleEditClose}>
              Cancel
            </Button>
          </Grid>
        </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};
