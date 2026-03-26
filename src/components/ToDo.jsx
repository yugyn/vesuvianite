import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ToDo = () => {

    const btnAddTask = useRef(null);
    const ulListTask = useRef(null);

    useEffect(() => {
    
        const btn = btnAddTask.current;
        const ul = ulListTask.current;

        const handleAddTask = async() => {
            const taskInput = document.getElementById('task-input');
            const title = taskInput.value.trim();
            await window.electronAPI.addTask(title);
            renderTasks();
        }

        if(btn) {
            btn.addEventListener('click', handleAddTask);
        }

        if(ulListTask) {
            renderTasks();
        }

        return () => {
            if(btn) {
                btn.removeEventListener('click', handleAddTask);
            }
        };

    }, []);

    const renderTasks = async () => {

        const taskList = document.getElementById('task-list');
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

    return (
        <div style={{ padding: '20px' }}>
        <h1>To-Do</h1>
        <Link to="/" className="btn">Torna alla Home</Link>

        <input id="task-input" placeholder="Add new task"></input>
        <button ref={btnAddTask}>+ task</button>
        <ul id="task-list" ref={ulListTask}></ul>
        </div>
    );

};


export default ToDo;