import {  useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.css"
import './App.css';
import Task from './Task';

function App() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4321/api/todos", {
      method: "GET"
    })
    .then( (res) => res.json())
    .then((result) => {
      setTasks(result);                   
    })
    .catch((err) => {
      console.log("Fetch initital data: " + err);
    })
  }, []);


  function setStage(id, stage){
    fetch("http://localhost:4321/api/todos/" + id, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        stan: stage
      })
    })
    .catch(err => {
      console.log("SetStage: " + err);
    })
    

    return setTasks(tasks.map((el, it) => {
      if(id !== el.nr)
        return el;
      else{
        return {nr: el.nr, zadanie: el.zadanie, tresc: el.tresc, stan: stage};
    }}))
  }

  function editTask(id){
    let titleVal = prompt("Podja nowy tytuł");
    let bodyVal = prompt("podaj nową treść");

    fetch("http://localhost:4321/api/todos/" + id, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        zadanie: titleVal,
        tresc: bodyVal,
      })
    })
    .catch(err => {
      console.log("EditTask: " + err);
    })

    return setTasks(tasks.map((el) => {
      if(id !== el.nr)
        return el;
      else{
        
        return {nr: el.nr, zadanie: titleVal.length === 0 ? el.zadanie : titleVal, 
          tresc: bodyVal.length === 0 ? el.tresc : bodyVal, 
          stan: el.stan
        }
      }}))
  }

  function deleteAction(id, e){
    fetch("http://localhost:4321/api/todos/" + id, {
      method: "DELETE"
    })
    .catch(err => {
      console.log("DeleteTask: " + err);
    })

    return setTasks(tasks.filter((el) => {if(id !== el.nr) return el;}));
  }
  
  return (
    <div className="App bg-dark d-flex align-items-center bg-gradient text-white">
      <div className='container'>
        <div className='d-inline-block border rounded-5 p-3 m-4'>
          <h1>Dodaj zadanie</h1>
          <div className='d-flex justify-content-center align-items-center '>
            <div className='d-flex flex-column me-4 text-black'>
              <div className="form-floating mb-2">
                <input type="text" className="form-control" id="txtTaskTitle" placeholder='tytuł'/>
                <label htmlFor="txtTaskTitle">Tytuł zadania</label>
              </div>
              <div className="form-floating">
                <input type="text" className="form-control" id="txtTaskBody" placeholder='treść'/>
                <label htmlFor="txtTaskBody">Treść zadania</label>
              </div>
            </div>
            <input className='btn btn-success' type='button' value='Dodaj zadanie' onClick={() => { 
              let titleVal = document.getElementById("txtTaskTitle").value;
              let bodyVal = document.getElementById("txtTaskBody").value;
              if(titleVal.length === 0 || bodyVal.length === 0)
                alert("Pola tekstowe nie mogą być puste");
              else{
                let id = tasks.length != 0 ? tasks[tasks.length - 1].nr + 1 : 0;
                fetch("http://localhost:4321/api/todos", {
                  method: "POST",
                  headers: {
                    "content-type": "application/json"
                  },
                  body: JSON.stringify({
                    nr: id,
                    zadanie: titleVal,
                    tresc: bodyVal,
                    stan: 0
                  })
                })
                .catch(err => {
                  console.log("AddTask: " + err);
                })
                
                setTasks([...tasks, {nr: id, zadanie: titleVal, tresc: bodyVal, stan: 0}]);
                document.getElementById("txtTaskTitle").value = "";
                document.getElementById("txtTaskBody").value = "";
              }}
            }/>
          </div>
        </div>
        <div className='container-fluid row gy-4 gx-0 pb-4 mt-5'>
          <div className='list list-0'>
              <h1 className='header'>ZADANIA NOWE</h1>
              {tasks.map((task, id) => {if(task.stan === 0) return (
                <Task key={id} id={task.nr} taskData={task}
                  deleteAction={deleteAction}
                  editAction={editTask}
                  stageAction={setStage}
              />)})}
          </div>
          <div className='list list-1'>
              <h1 className='header'>ZADANIA AKTUALNE</h1>
              {tasks.map((task, id) => {if(task.stan === 1) return (
                <Task key={id} id={task.nr} taskData={task}
                  deleteAction={deleteAction}
                  editAction={editTask}
                  stageAction={setStage}
              />)})}
          </div>
          <div className='list list-2 finished'>
              <h1 className='header'>ZADANIA SKONCZONE</h1>
              {tasks.map((task, id) => {if(task.stan === 2) return (
                <Task key={id} id={task.nr} taskData={task}
                  deleteAction={deleteAction}
                  editAction={editTask}
                  stageAction={setStage}
              />)})}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
