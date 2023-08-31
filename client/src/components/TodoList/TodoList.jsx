import React, { useState, useEffect } from 'react';
import TaskList from '../TaskList/TaskList';
import service from "../../api/apiHandler";
import "../../styles/todolist.css";

const TodoList = () =>{
  const [todoLists, setTodoLists] = useState([]);
  const [selectedTodoList, setSelectedTodoList] = useState({});
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({});
  const [newTodoName, setNewTodoName] = useState("");
  const [editTodoName, setEditTodoName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    service.get('/api/me/todoList')
      .then((response) => {
        setTodoLists(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

function handleInputChange(event) {
  setTodoLists(event.target.value);
}

function handleEditInputChange(event) {
  setSelectedTodoList({...selectedTodoList, title: event.target.value});
  console.log(selectedTodoList);
}
  function handleTodoListCreate(title) {
    service.post(`/api/me/todoList`, { title })
      .then((response) => {
        setTodoLists([...todoLists, response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleTodoListDelete(todoList) {
    service.delete(`/api/me/todoList/${todoList._id}`)
      .then(() => {
        const newTodoLists = todoLists.filter((tl) => tl._id !== todoList._id);
        setTodoLists(newTodoLists);
        setSelectedTodoList(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleTodoListUpdate(id, title) {
    if (!id) {
      console.error('Invalid todo list ID');
      return;
    }
    service.put(`/api/me/todoList/${id}`, {title})
      .then((response) => {
        console.log(response.data);
        const index = todoLists.findIndex((tl) => tl._id === response.data._id);
        const newTodoLists = [...todoLists];
        newTodoLists[index] = response.data;
        setTodoLists(newTodoLists);
        setSelectedTodoList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleTaskCreate(task) {
    service.post(`/api/me/task/${selectedTodoList._id}/tasks`, task)
      .then((response) => {
        setTasks([...tasks, response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleTaskUpdate(task) {
    service.put(`/api/me/task/${task._id}`, task)
      .then((response) => {
        const index = tasks.findIndex((t) => t._id === response.data._id);
        const newTasks = [...tasks];
        newTasks[index] = response.data;
        setTasks(newTasks);
        setSelectedTask(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleTaskDelete(task) {
    service.delete(`/api/me/task/${task._id}`)
      .then(() => {
        const newTasks = tasks.filter((t) => t._id !== task._id);
        setTasks(newTasks);
        setSelectedTask(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleNewTodoSubmit(event) {
    event.preventDefault();
    handleTodoListCreate(newTodoName);
    setNewTodoName("");
  }

  function handleEditTodoSubmit(event) {
    event.preventDefault();
    handleTodoListUpdate({ ...selectedTodoList, title: editTodoName });
    setEditTodoName("");
  }
  // function to handle when the "Edit" button is clicked
function handleEditTodoList(todoLists) { 
  

  // {{chamseddine try }}
  // setIsEditing(true);
  // setSelectedTodoList({...todoLists});
}
  return (
    <div className='todo-list'>
      <h1>Todo List App</h1>
      {isEditing ? (
      <form onSubmit={handleEditTodoSubmit}>
                <label className='todo-item label'>
                  Edit Todo Name:
                  <input
                    type="text"
                    value={selectedTodoList.title}
                    onChange={handleEditInputChange}
                  />
                </label>
                <button type="submit" className='todo-item button'>Update Todo</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </form>) : (
      <form onSubmit={handleNewTodoSubmit}>
        <label>
          New Todo Name:
          <input
            type="text"
            value={newTodoName}
            onChange={(event) => setNewTodoName(event.target.value)}
          />
        </label>
        <button type="submit">Add Todo</button>
      
      </form>)}
      {todoLists.length === 0 ? (
        <div>No todo</div>
      ) : (
        <div>
          <div>
            <h2>Todo Lists</h2>
            {todoLists.map((todoList) => (
              <div key={todoList._id}>
                <button onClick={() => setSelectedTodoList(todoList)}>
                  {todoList.title}
                </button>
                <button onClick={() => handleTodoListDelete(todoList)}>
                  Delete
                </button>
                <button onClick={() => handleEditTodoList(todoList)}>Edit</button>
              </div>
            ))}
          </div>
          {selectedTodoList && (
            <div>
              <h2>Tasks</h2>
              <TaskList
                tasks={tasks}
                selectedTask={selectedTask}
                onTaskCreate={handleTaskCreate}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
              />
              
            </div>
          )}
        </div>
      )}
    </div>
  );
}
                

export default TodoList;

  //   return (
  //     <div>
  //       <h1>Todo List App</h1>
  //       <div>
  //         <h2>Todo Lists</h2>
  //         {todoLists.map((todoList) => (
  //           <div key={todoList._id}>
  //             <button onClick={() => setSelectedTodoList(todoList)}>
  //               {todoList.name}
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //       {selectedTodoList && (
  //         <div>
  //           <h2>Tasks</h2>
  //           <TaskList
  //             tasks={tasks}
  //             selectedTask={selectedTask}
  //             onTaskCreate={handleTaskCreate}
  //             onTaskUpdate={handleTaskUpdate}
  //             onTaskDelete={handleTaskDelete}
  //             onTaskSelect={setSelectedTask}
  //           />
  //         </div>
  //       )}
  //     </div>
  //   );
  // }

  // export default TodoList;
//     <div>
//       <h1>Todo List App</h1>
//       <div>
//         <h2>Todo Lists</h2>
//         <TodoList
//           todoLists={todoLists}
//           selectedTodoList={selectedTodoList}
//           onTodoListCreate={handleTodoListCreate}
//           onTodoListUpdate={handleTodoListUpdate}
//           onTodoListDelete={handleTodoListDelete}
//           onTodoListSelect={setSelectedTodoList}
//         />
//       </div>
//       {selectedTodoList && (
//         <div>
//           <h2>Tasks</h2>
//           <TaskList
//             tasks={tasks}
//             selectedTask={selectedTask}
//             onTaskCreate={handleTaskCreate}
//             onTaskUpdate={handleTaskUpdate}
//             onTaskDelete={handleTaskDelete}
//             onTaskSelect={setSelectedTask}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default TodoList;
