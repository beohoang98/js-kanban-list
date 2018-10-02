(function() {
    document.addEventListener('DOMContentLoaded', main);
})();

function main() {
    checkFirstTime();

    const task = new Task();
    initialDisplay(task);
    
    task.onUpdateTask((info) => {
        showForm(info);
        afterSubmitForm((editedInfo) => {
            hideForm();
            task.updateTask(info.id, editedInfo);
            
            const element = document.getElementById(info.id);
            const editedElement = task.createElement(editedInfo);
            element.childNodes.length = 0;
            editedElement.childNodes.forEach(node=>{
                element.appendChild(node);
            });
        });
    });
    task.onRemoveTask((info) => {
        $('#ask-modal').modal('show');
        $('#ask-yes').on('click', () => {
            task.removeTask(info.id);
            $('#ask-yes').off('click');
            document.getElementById(info.id).remove();
        });
    });

    let afterSubmitFunc = () => {};

    function afterSubmitForm(func) {
        afterSubmitFunc = func;
    }

    document.getElementById('add-task').addEventListener('submit', (e) => {
        e.preventDefault();
        const formElements = e.target.elements;
        const info = {
            title: formElements.title.value,
            content: formElements.content.value,
            due_time: formElements.due_time.value
        };
        afterSubmitFunc(info);
    });

    document.querySelectorAll('.add-column').forEach((button) => {
        button.onclick = async ()=>{
            showForm();
            afterSubmitForm((newTaskInfo) => {
                hideForm();

                const taskInfo = Task.newTask(newTaskInfo, button.parentElement.id);
                task.addTask(taskInfo);
                button.nextElementSibling.appendChild(task.createElement(taskInfo));

                displayProgress(task);
            });
        };
    });

    document.querySelectorAll('.todo-column').forEach((column) => {
        $(column).on('dragenter dragover', (e) => {
            e.preventDefault();
            column.classList.add('dragover');
        })
        $(column).on('dragleave | dragend', (e) => {
            // e.preventDefault();
            column.classList.remove('dragover');
        })

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            const type = column.id;

            const id = e.dataTransfer.getData('id');
            const el = document.getElementById(id);
            task.updateTask(id, {type});
            displayProgress(task);
            
            column.querySelector('.todo-column-body').appendChild(el);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") hideForm();
    });
}

function displayProgress(taskData) {
    const count = taskData.getCount();

    document.querySelector('#progress .progress-todo').style.width = count.todoCount * 100 / count.total + '%';
    document.querySelector('#progress .progress-doing').style.width = count.doingCount * 100 / count.total + '%';
    document.querySelector('#progress .progress-done').style.width = count.doneCount * 100 / count.total + '%';
}

function showForm(info) {
    $('#add-task-modal').modal('show');
    const form = document.getElementById('add-task');
    form.reset();

    if (info) {
        for (const key of Object.keys(info)) {
            if (form.elements.hasOwnProperty(key))
                form.elements[key].value = info[key];
        }
    }
}

function hideForm() {
    $('#add-task-modal').modal('hide');
}

function initialDisplay(task) {
    for (const taskinfo of Object.values(task.task)) {
        const type = taskinfo.type || 'todo';
        const element = task.createElement(taskinfo);
        const columnBody = document.querySelector(`#${type} .todo-column-body`);
        columnBody.appendChild(element);
    }
    displayProgress(task);
}

function checkFirstTime() {
    const match = document.cookie.match(/used=(\w+)/);
    if (!match || !match[1]) {
        $('#first-app-use').modal('show');
        $('#first-app-use button').click(() => {
            document.cookie = 'used=true; expired=' + 3600*24*365;
        });
    }
}
