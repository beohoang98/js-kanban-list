(function() {
    document.addEventListener('DOMContentLoaded', main);
})();

function main() {

    const data = new LoadData();
    data.load();

    document.querySelectorAll('.add-column').forEach((button) => {
        button.onclick = async ()=>{
            showForm();
            const info = await addTask();
            hideForm();
            
            task[info.id] = info;

            const element = createTaskElement(info);
            button.nextElementSibling.appendChild(element);
        };
    });

    document.querySelectorAll('.todo-column').forEach((column) => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('id');
            const el = document.getElementById(id);
            column.appendChild(el);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Enter") hideForm();
    });
}

/**
 * @return task object
 */
async function addTask() {
    const form = document.querySelector('#add-task');

    return new Promise((resovle) => {
        form.onsubmit = (e) => {
            e.preventDefault();
            const info = {
                title: null,
                des: null,
                time: null
            };
            Object.keys(info).forEach(key=>{
                info[key] = form.elements[key].value;
            });
            info.id = uuid();
            info.done = false;

            resovle(info);
        }
    });
}

function uuid() {
    
}

function showForm() {
    document.getElementById('add-task-modal').classList.add('active');
}

function hideForm() {
    document.getElementByClassName('modal').classList.remove('active');
}