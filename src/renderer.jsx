import 'bootstrap/dist/css/bootstrap.css'
import React, {Component} from 'react';

import {createRoot} from 'react-dom/client';
import Navbar from './components/Navbar';
import Card from './components/Card';

import vesuvio from './images/1.jpg';
import campiFlegrei from './images/2.jpg';
import tufoGrigio from './images/3.jpg';
import caserta from './images/4.jpg';
import hirpinia from './images/5.jpg';
import sannio from './images/6.jpg';
import salerno from './images/7.jpg';

class App extends Component {

  state = {
    cards: [
      {id: 1, name: "Vesuvio", description: "Minerali del Vesuvio", image: vesuvio, quantity: 0},
      {id: 2, name: "Campi Flegrei", description: "Minerali dei Campi Flegrei", image: campiFlegrei, quantity: 0},
      {id: 3, name: "Tufo grigio", description: "Minerali del tufo grigio", image: tufoGrigio, quantity: 0},
      {id: 4, name: "Caserta", description: "Minerali di Caserta", image: caserta, quantity: 0},
      {id: 5, name: "Hirpinia", description: "Minerali dell'Hirpinia", image: hirpinia, quantity: 0},
      {id: 6, name: "Sannio", description: "Minerali del Sannio", image: sannio, quantity: 0},
      {id: 7, name: "Salerno", description: "Minerali di Salerno", image: salerno, quantity: 0},
    ]
  }

  render() {

    return (
      <>
        <Navbar/>
        <div className='container'>
          <h1>Minerali del Vesuvio</h1>
          <hr/>
          <div className='row'>
            {this.state.cards.map(card => (
              <Card 
                key={card.id}
                onDelete={this.handleDelete}
                onIncrement={this.handleIncrement}
                card={card}
              />
            ))}
          </div>
        </div>
      </>
    );

  }

  handleDelete = cardId => {
    const cards = this.state.cards.filter(card => card.id !== cardId);
    this.setState({cards: cards});
  }

  handleIncrement = card => {
    const cards = [...this.state.cards];
    const id = cards.indexOf(card);
    cards[id] = {...card};
    cards[id].quantity++;
    this.setState({cards});

  }

  handleOpenWindow () {
    console.log("aprendo la finestra...");
    window.electronAPI.openWindow();
  };
  
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

const handleAddTask = async() => {
  const title = taskInput.value.trim();
  await window.electronAPI.addTask(title);
  renderTasks();
}

addTaskBtn.addEventListener('click', handleAddTask);

const renderTasks = async () => {
  const tasks = await window.electronAPI.getAllTasks();
  taskList.innerHTML = '';
  tasks.forEach(task => {
    
    const li = document.createElement('li');
    
    const titleSpan = document.createElement('span');
    titleSpan.textContent = task.title;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', async() => {
      await window.electronAPI.completeTask({id: task.id, completed: checkbox.checked ? 1 : 0})
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.addEventListener('click', async() => {
      await window.electronAPI.deleteTask(task.id);
      renderTasks();
    })
    deleteBtn.textContent = 'Delete';

    li.appendChild(titleSpan);
    li.appendChild(checkbox);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

  });
}


renderTasks();
