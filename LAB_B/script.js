class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.term = '';
        this.draw();
        this.currentEditIndex = -1;
    }

    getFilteredTasks() {
        return this.tasks.filter(task => task.text.toLowerCase().includes(this.term.toLowerCase()));
    }

    draw() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        const filteredTasks = this.getFilteredTasks();
        filteredTasks.forEach((task, index) => {
            const newTask = document.createElement('li');

            if (this.currentEditIndex === index) {
                newTask.innerHTML = `
                    <input type="text" value="${task.text}" id="editInput${index}" />
                    <input type="date" value="${task.deadline || ''}" id="editDeadline${index}" />
                `;
                setTimeout(() => {
                    const editInput = document.getElementById(`editInput${index}`);
                    editInput.focus();
                }, 0);
            } else {
                const highlightedText = task.text.replace(new RegExp(`(${this.term})`, 'gi'), '<strong>$1</strong>');
                newTask.innerHTML = `
                    <span class="task-text">${highlightedText}${task.deadline ? ` - ${task.deadline}` : ''}</span>
                    <button onclick="todo.deleteTask(${index})">Delete</button>
                `;
            }

            newTask.onclick = (event) => {
                if (event.target.tagName !== 'BUTTON') {
                    this.startEdit(index);
                }
            };
            taskList.appendChild(newTask);
        });

        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    startEdit(index) {
        this.currentEditIndex = index;
        this.draw();
    }

    saveTask(index) {
        const editInput = document.getElementById(`editInput${index}`);
        const editDeadline = document.getElementById(`editDeadline${index}`);
        const newText = editInput.value.trim();
        const newDeadline = editDeadline.value;

        if (newText.length < 3 || newText.length > 255) {
            alert('Zadanie musi mieć od 3 do 255 znaków.');
            return;
        }

        if (newDeadline && new Date(newDeadline) < new Date()) {
            alert('Data musi być pusta lub w przyszłości.');
            return;
        }

        this.tasks[index].text = newText;
        this.tasks[index].deadline = newDeadline;
        this.currentEditIndex = -1;
        this.draw();
    }

    addTask(taskText, deadline) {
        if (taskText.length < 3 || taskText.length > 255) {
            alert('Zadanie musi mieć od 3 do 255 znaków.');
            return;
        }

        if (deadline && new Date(deadline) < new Date()) {
            alert('Data musi być pusta lub w przyszłości.');
            return;
        }

        this.tasks.push({ text: taskText, deadline });
        this.draw();
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.draw();
    }

    updateSearch() {
        this.term = document.getElementById('searchInput').value.trim();
        this.draw();
    }
}

const todo = new Todo();

function addTask() {
    const taskInput = document.getElementById('taskInput').value.trim();
    const deadlineInput = document.getElementById('deadlineInput').value;
    todo.addTask(taskInput, deadlineInput);
    document.getElementById('taskInput').value = '';
    document.getElementById('deadlineInput').value = '';
}

document.addEventListener('click', (event) => {
    if (event.target.closest('li')) {
        return;
    }
    if (todo.currentEditIndex >= 0) {
        todo.saveTask(todo.currentEditIndex);
    }
});
