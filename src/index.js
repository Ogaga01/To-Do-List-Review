import './style.css';
import ViewMore from './images/view-more.png';
import addNewTask from './addtask.js';
import editTask from './edittask.js';
import { setStorage, getStorage } from './localstorage.js';
import Delete from './removetask.js';
import completed from './clearall.js';

const addTask = document.getElementById('add-new-task');
const currentTasks = document.querySelector('.current-tasks');
const clearCompleted = document.getElementById('completed');

const tasks = getStorage();

// Delete a task from local storage
const removeIndex = (index) => {
  setStorage(Delete.deleteOne(getStorage(), index));
  populateTasks(getStorage()); // eslint-disable-line
};

// Delete all completed tasks from local storage

clearCompleted.addEventListener('click', () => {
  Delete.deleteAll(getStorage());
    populateTasks(getStorage()); // eslint-disable-line
});

const populateTasks = (arr) => {
  currentTasks.innerHTML = '';
  for (let i = 0; i <= arr.length; i += 1) {
    // Add an item to local storage
    const newDiv = document.createElement('div');
    newDiv.className = 'to-do-item';
    const tick = document.createElement('input');
    const description = document.createElement('input');
    description.className = 'task-description';
    const menuImg = document.createElement('img');
    menuImg.src = `${ViewMore}`;
    tick.setAttribute('type', 'checkbox');
    tick.id = i;
    newDiv.id = `item${i}`;
    newDiv.append(tick);
    description.value = `${arr[i].description}`;
    newDiv.append(description);
    newDiv.append(menuImg);
    currentTasks.appendChild(newDiv);

    // Check which checkboxes are clicked.
    if (arr[i].completed === 'true') {
      tick.checked = true;
      newDiv.style.textDecoration = 'line-through';
    }

    // Double click the input area to display the delete icon
    description.addEventListener('dblclick', () => {
      newDiv.classList.add('edit-mode');
      newDiv.innerHTML = `<input type="checkbox" id="${i}"></input><input id = "update${i}" class="update" type="text" value = "${arr[i].description}"></input><i id="delete${i}" class="fas fa-trash-alt"></i>`;
      document.getElementById(`update${i}`).focus();
      document.getElementById(`delete${i}`).addEventListener('click', () => {
        removeIndex(i);
      });
    });

    // Update task on clicking body
    document.body.addEventListener('click', (e) => {
      if (!newDiv.contains(e.target) && document.getElementById(`update${i}`)) {
        newDiv.classList.remove('edit-mode');
        const arr = getStorage();
        completed(editTask(arr, i));
        setStorage(editTask(arr, i));
        populateTasks(editTask(arr, i));
      }
    });
  }
  setStorage(arr);
};

// Add new task
addTask.addEventListener('click', () => {
  populateTasks(addNewTask(getStorage()));
});

// call completed function to update task status
document.body.addEventListener('change', () => {
  completed(getStorage());
});

// Display tasks
document.addEventListener('DOMContentLoaded', () => {
  populateTasks(tasks);
});