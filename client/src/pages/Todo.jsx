import {
  Grid,
  Button,
  Box,
  Dialog,
  DialogContent,
  TextField,
  DialogTitle
} from '@mui/material';
import TodoList from '../components/Todos/TodoList';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function Todo() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const userId = localStorage.getItem("id");
  const getUserTodos = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/me/todoList/findByUserId/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const responseData = response.data;
      setData(responseData);
    } catch (error) {
      console.error("Error fetching user todos:", error);
    }
  }
  const handleAddOpen = () => {
    setOpen(true);
  };
  const handleAddClose = () => {
    setOpen(false);
  }
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    try {
      await axios.post(
        'http://localhost:8080/api/me/todoList/',
        {
          title: event.target.name.value,
          user : localStorage.getItem("id")
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      handleAddClose();
      getUserTodos(); // Refresh the todo list after adding a new item
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };
  const handleEditRefresh = () => {
    getUserTodos(); // Refresh the todo list after editing
  };
  useEffect(() => {
    getUserTodos();
  }, [])
  return (
    <><Grid
      sx={{
        px: 4
      }}
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={4}
    >
      <Grid item xs={12}>
        <Grid item textAlign="right" sx={{mb:3}}>
          <Button
            onClick={() => handleAddOpen()}
            variant='contained'
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Crate New Todo
          </Button>
        </Grid>
        {data?.length > 0 ? (<TodoList data={data} onEdit={handleEditRefresh}/>) : <p>Loading...</p>}
      </Grid>
    </Grid>
      <Dialog open={open} onClose={handleAddClose} fullwiraflaa>
        <DialogTitle>
          Add New Todo
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={0}>
             <Grid item xs={12} sm={4} md={3} justifyContent="flex-end" textAlign={{ sm: 'right' }}>
              <Box pr={3} sx={{ pt: 2 }} alignSelf="center">
                <b>Title</b>
              </Box>
            </Grid>
              <Grid sx={{mb:3}}item xs={12} sm={8} md={9}>
                <TextField
                  fullWidth
                  name="name"
                  placeholder="write your todo name here"
                  variant="outlined" />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} />
            <Grid sx={{ mb: 3 }} item xs={12} sm={8} md={9}>
              <Button sx={{ mr: 2 }} type="submit" variant="contained" size="large" >
                Create TodoList
              </Button>
              <Button sx={{ pt: 1 }} color="secondary" size="large" variant="outlined" onClick={handleAddClose}>
                Cancel
              </Button>
            </Grid>
          </DialogContent>
        </form>
      </Dialog></>
  );
}

export default Todo;
