import React from 'react';
import {
  Box,
  Card,
  Badge,
  Typography,
  Divider,
  Grid,
  styled,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

const CardBorderBottom = styled(Card)(
  () => `
        border-bottom: transparent 5px solid;
        border-radius: 20px;
  `
);

function TodoList({data , onEdit}) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [actuaTodo,setActualTodo]= React.useState('');
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate("/task",{state:{id}})
  };

  const handleEditOpen = (item) => {
    setActualTodo(item)
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
  }
  const handleEdit = async (event) => {
    event.preventDefault(); 
    try {
      await axios.put(
        `http://localhost:8080/api/me/todoList/${actuaTodo._id}`,
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

      handleEditClose();
      onEdit(); // Refresh the todo list after adding a new item
    } catch (error) {
      console.error('Error Updating todo:', error);
    }
  }
  const deleteTodo = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/me/todoList/${taskId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      // Refresh the todo list after deleting
      onEdit()
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  return (
      <>
      <Grid container spacing={4}>
        {data.map((item) => (
          <Grid item xs={12} md={4}>
            <CardBorderBottom
              sx={{
                borderBottomColor: "blue",
              }}
            >
              <Box p={2} onClick={() => handleClick(item._id)}>
                {item.title}
                <Box mt={1.5} display="flex">
                  <Box mr={0.5}>
                    <Badge
                      color= {item.allTasksCompleted ? "success" : "warning"}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      badgeContent=" "
                      overlap="circular"
                    >
                    </Badge>
                  </Box>
                </Box>
              </Box>
              <Divider />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={2}
                sx={{
                  background: "grey"
                }}
              >
                <Typography
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  variant="subtitle1"
                >
                  <ScheduleTwoToneIcon
                    sx={{
                      mr: 0.4
                    }}
                    fontSize="small" />
                  {item.createdAt}
                </Typography>
                <Button>
                  <EditIcon  onClick={() => handleEditOpen(item)} />
                  <FontAwesomeIcon icon={faTrash} onClick={() => deleteTodo(item._id)} />
                </Button>
              </Box>
            </CardBorderBottom>
          
          </Grid>
        ))}
      </Grid>
      <Dialog open={openEdit} onClose={handleEditClose} fullWidth>
        <DialogTitle>
          Edit Todo
        </DialogTitle>
        <form onSubmit={handleEdit}>
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
                  placeholder="write your todo title here"
                  value={actuaTodo.title}
                  onChange={(e) => setActualTodo({ ...actuaTodo, title: e.target.value })}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={12} md={12} textAlign={{ sm: 'center' }}>
                <Button sx={{ mr: 2 }} type="submit" variant="contained" size="large" >
                  Update TodoList
                </Button>
                <Button sx={{ pt: 1 }} color="secondary" size="large" variant="outlined" onClick={handleEditClose}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </form>
      </Dialog>

      </>
  );
}

export default TodoList;
