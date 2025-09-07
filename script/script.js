// Load From Storage on Page Load (1/3)
window.addEventListener('DOMContentLoaded', () => {
    const tasks = loadStorage(); // load saved tasks
    tasks.forEach((task) => createItem(task.text, task.done)); // recreate each
    visible();
    counter();
    filterTasks();
});

// Initial Variables
const taskInput = document.querySelector('#task-input');
const addBtn = document.querySelector('#btn-add');
const taskList = document.querySelector('#task-list');
const select = document.querySelector('#filter-menu');
const sidebar = document.querySelector('.sidebar');
const clear = document.querySelector('#clear-comp');
const markDone = document.querySelector('#mark-done');
const themeTog = document.querySelector('.theme');

// Reusable Functions

// Toggle visibility
const visible = () => {
    if (taskList.children.length === 0) {
        sidebar.classList.add('hidden');
        taskList.classList.add('hidden');
    } else if (taskList.children.length >= 1) {
        sidebar.classList.remove('hidden');
        taskList.classList.remove('hidden');
    }
};

// Theme toggle
const themeSwitch = () => {
    const body = document.querySelector('body');
    const addBar = document.querySelector('.add');
    const taskItems = document.querySelectorAll('#task-list li');
    const allBtn = document.querySelectorAll('button');

    if (body.classList.contains('light')) {
        body.classList.remove('light');
        body.classList.add('dark');

        taskList.classList.remove('light-box');
        taskList.classList.add('dark-box');

        sidebar.classList.remove('light-box');
        sidebar.classList.add('dark-box');

        addBar.classList.remove('light-box');
        addBar.classList.add('dark-box');

        themeTog.innerHTML = '<i class="fa-solid fa-moon"></i>';
        themeTog.querySelector('i').classList.add('animate');
        setTimeout(() => themeTog.querySelector('i').classList.remove('animate'), 300);

        taskItems.forEach((item) => {
            item.classList.remove('li-light');
            item.classList.add('li-dark');
        });

        allBtn.forEach((btn) => {
            btn.classList.remove('light-box');
            btn.classList.add('dark-box');
        });
    } else {
        body.classList.remove('dark');
        body.classList.add('light');

        taskList.classList.remove('dark-box');
        taskList.classList.add('light-box');

        sidebar.classList.remove('dark-box');
        sidebar.classList.add('light-box');

        addBar.classList.remove('dark-box');
        addBar.classList.add('light-box');

        themeTog.innerHTML = '<i class="fa-solid fa-sun"></i>';
        themeTog.querySelector('i').classList.add('animate');
        setTimeout(() => themeTog.querySelector('i').classList.remove('animate'), 300);

        taskItems.forEach((item) => {
            item.classList.remove('li-dark');
            item.classList.add('li-light');
        });

        allBtn.forEach((btn) => {
            btn.classList.remove('dark-box');
            btn.classList.add('light-box');
        });
    }
};

// Add Item + Save to Storage (2/3)
const addItem = () => {
    const inputText = taskInput.value.trim();
    if (inputText === '') return;
    createItem(inputText); // adds to DOM
    filterTasks();
    taskInput.value = '';
    taskInput.focus();

    // 🔹 Save to LocalStorage
    const tasks = loadStorage();
    tasks.push({ text: inputText, done: false });
    updateStorage(tasks);
    visible();
    counter();
};

// Create Items
const createItem = (text, done = false) => {
    const textDiv = document.createElement('div');
    const btnDiv = document.createElement('div');
    const li = document.createElement('li');
    const textSpan = document.createElement('span');
    const deleteBtn = document.createElement('button');
    const doneBtn = document.createElement('button');
    const editBtn = document.createElement('button');

    li.classList.add('li-dark');
    textDiv.classList.add('text-div');
    btnDiv.classList.add('btn-div');
    editBtn.classList.add('btn-box', 'dark-box');
    doneBtn.classList.add('btn-box', 'dark-box');
    deleteBtn.classList.add('btn-box', 'dark-box');
    if (done) li.classList.add('done');

    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    textSpan.textContent = text;
    textDiv.appendChild(textSpan);
    btnDiv.append(editBtn, doneBtn, deleteBtn);
    li.append(textDiv, btnDiv);
    taskList.appendChild(li);
    
    requestAnimationFrame(() => {
        li.classList.add('show');
    });

    editBtn.addEventListener('click', () => edit(li));
    deleteBtn.addEventListener('click', () => deleteItem(li));
    doneBtn.addEventListener('click', () => toggleDone(li));
    filterTasks();
};

// Edit (no changes to localStorage yet)
const edit = (task) => {
    const editInput = document.createElement('input');
    const text = task.childNodes[0].textContent;
    editInput.value = text;
    task.replaceWith(editInput);
    editInput.focus();

    let finished = false;
    const finishEdit = () => {
        if (finished) return;
        finished = true;

        const text = editInput.value.trim();
        if (text === '') return;
        createItem(text);
        editInput.remove();

        // 🔹 Optional: update localStorage here (delete+add again)
        const tasks = loadStorage();
        const index = Array.from(taskList.children).indexOf(task);
        if (index !== -1) {
            tasks.splice(index, 1, { text, done: false });
            updateStorage(tasks);
        }
        counter();
    };

    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEdit();
    });
    editInput.addEventListener('blur', () => finishEdit());
};

// Delete Items + Save to Storage (2/3)
const deleteItem = (task) => {
    task.classList.add('fade-out'); // triggers CSS animation

    setTimeout(() => {
        const index = Array.from(taskList.children).indexOf(task);
        task.remove();

        const tasks = loadStorage();
        tasks.splice(index, 1);
        updateStorage(tasks);
        visible();
        counter();
    }, 300); // match transition duration
};

// Toggle done + Save to Storage (2/3)
const toggleDone = (item) => {
    item.classList.toggle('done');
    filterTasks();

    // 🔹 Update LocalStorage done status
    const index = Array.from(taskList.children).indexOf(item);
    const tasks = loadStorage();
    if (tasks[index]) {
        tasks[index].done = item.classList.contains('done');
        updateStorage(tasks);
    }
    counter();
};

// Filter
const filterTasks = () => {
    const taskItems = document.querySelectorAll('#task-list li');
    const option = select.value;

    taskItems.forEach((li) => {
        const isDone = li.classList.contains('done');

        if (option === 'All Items') li.classList.remove('hidden');
        else if (option === 'Incomplete') {
            if (isDone) li.classList.add('hidden');
            else li.classList.remove('hidden');
        } else if (option === 'Completed') {
            if (!isDone) li.classList.add('hidden');
            else li.classList.remove('hidden');
        }
    });
};

// Counter
const counter = () => {
    const taskItems = document.querySelectorAll('#task-list li');
    const totalValue = document.querySelector('#total');
    const compValue = document.querySelector('#complete');
    const incompValue = document.querySelector('#incomplete');

    totalValue.textContent = taskList.children.length;
    compValue.textContent = Array.from(taskItems).filter((li) =>
        li.classList.contains('done')
    ).length;
    incompValue.textContent = totalValue.textContent - compValue.textContent;
};

// Mark all as completed
const markAll = () => {
    const taskItems = document.querySelectorAll('#task-list li');
    taskItems.forEach((li) => {
        if (!li.classList.contains('done')) {
            li.classList.toggle('done');
        }
    });
    filterTasks();
    counter();
};

// Clear Completed + Update Storage (2/3)
const clearComp = () => {
    const tasks = loadStorage().filter((_, i) => {
        const li = taskList.children[i];
        return !li.classList.contains('done');
    });

    // 🔹 Update storage first
    updateStorage(tasks);

    // 🔹 Remove from DOM after filtering
    [...taskList.children].forEach((li) => {
        if (li.classList.contains('done')) {
            li.remove();
        }
    });

    visible();
    counter();
};

// (3/3) Storage Utility Functions
const updateStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const loadStorage = () => {
    return JSON.parse(localStorage.getItem('tasks')) || [];
};

// Event Listeners
addBtn.addEventListener('click', addItem);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addItem();
});
select.addEventListener('change', filterTasks);
clear.addEventListener('click', clearComp);
markDone.addEventListener('click', markAll);
themeTog.addEventListener('click', themeSwitch);
