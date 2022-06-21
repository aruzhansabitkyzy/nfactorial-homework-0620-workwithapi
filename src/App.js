import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";
import { TodoistApi } from '@doist/todoist-api-typescript';

const BACKEND_URL = "http://10.65.132.54:3000";
const api = new TodoistApi('859e0984eb551022917c0fb33ce3885443227596');
/*
* Plan:
*   1. Define backend url
*   2. Get items and show them +
*   3. Toggle item done +
*   4. Handle item add +
*   5. Delete +
*   6. Filter
*
* */

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [completed, setCompleted] = useState([]);
  // let complete = false;
  const [complete, setComplete] = useState(false)

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleNotCompleted = () => {
   
    setComplete(false);
  }

  const handleCompleted = () => {
    setComplete(true);

    axios.get(`https://api.todoist.com/sync/v8/completed/get_all`, {
          headers : {
            Authorization : "Bearer 859e0984eb551022917c0fb33ce3885443227596"
          }
      }).then((response) => {
          setCompleted(response.data.items);
          console.log(response.data.items);
          console.log(completed);
      })
  }

  const handleAddItem = () => {
    // axios.post(`${BACKEND_URL}/todos`, {
    //     label:itemToAdd,
    //     done: false
    // }).then((response) => {
    //     setItems([ ...items, response.data])
    // })
    // setItemToAdd("");
  
          api.addTask({
              content: itemToAdd
          })
          .then((task) =>{
           
            setItems([task, ...items]);
            console.log(items);
            setItemToAdd("");
          })
          .catch((error) => {
            console.log(error)
          })
    
        
  };


  const toggleItemDone = ({ id, done }) => {

       api.closeTask(
           id
       )
       .then((done) => console.log(done))
       .catch((error) => console.log(error))


      // axios.put(`${BACKEND_URL}/todos/${id}`, {
      //     done: !done
      // }).then((response) => {
      //     setItems(items.map((item) => {
      //         if (item.id === id) {
      //             return {
      //                 ...item,
      //                 done: !done
      //             }
      //         }
      //         return item
      //     }))

      // })
  };

  // N => map => N
    // N => filter => 0...N
  const handleItemDelete = (id) => {
      axios.delete(`${BACKEND_URL}/todos/${id}`).then((response) => {
          const deletedItem = response.data;
          console.log('Было:',items)
          const newItems = items.filter((item) => {
              return deletedItem.id !== item.id
          })
          console.log('Осталось:',newItems)
          setItems(newItems)
      })
  };

  useEffect(() => {
      axios.get(`https://api.todoist.com/rest/v1/tasks`, {
          headers : {
            Authorization : "Bearer 859e0984eb551022917c0fb33ce3885443227596"
          }
      }).then((response) => {
          setItems(response.data);
      })
    // }
  }, []);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>
      <button className="uncomplete" onClick = {handleNotCompleted}>Uncompleted</button>
      <button className ="complete" onClick={handleCompleted}>Completed</button>

      {/* List-group */}
      <ul className="list-group todo-list">
        {!complete ? (
            items.map((item) => (
              <li key={item.id} className="list-group-item">
                <span className={`todo-list-item${item.done ? " done" : ""}`}>
                  <span
                    className="todo-list-item-label" 
                    onClick={() => toggleItemDone(item)}
                  >
                    {item.content}
                  </span>
  
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm float-right"
                  >
                    <i className="fa fa-exclamation" />
                  </button>
  
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm float-right"
                    onClick={() => handleItemDelete(item.id)}
                  >
                    <i className="fa fa-trash-o" />
                  </button>
                </span>
              </li>
            ))
          ) : (
            
              completed.map((item) => (
                <li key={item.id} className="list-group-item">
                  <span className={`todo-list-item${item.done ? " done" : ""}`}>
                    <span
                      className="todo-list-item-label" 
                      onClick={() => toggleItemDone(item)}
                    >
                      {item.content}
                    </span>
    
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm float-right"
                    >
                      <i className="fa fa-exclamation" />
                    </button>
    
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm float-right"
                      onClick={() => handleItemDelete(item.id)}
                    >
                      <i className="fa fa-trash-o" />
                    </button>
                  </span>
                </li>
              )
            )
          )}

       
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
