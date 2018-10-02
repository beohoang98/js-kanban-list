class Task {
    constructor() {
        this.task = new LoadData();
        this.task.load();
    }

    newTask(info, type = 'todo') {
        const id = this.make_id();
        return {
            id,
            title: info.title || 'No name',
            content: info.content || '',
            due_time: info.due_time || null,
            type,
        };
    }

    addTask(taskInfo) {
        this.task[taskInfo.id] = taskInfo;
    }

    updateTask(id, info) {
        for (const key in info) {
            this.task[id][key] = info[key];
        }
    }

    removeTask

    createElement(taskInfo) {
        const title = info.title || 'Title';
        const des = info.des || 'Description';
        const time = info.time || (new Date());

        const element = document.createElement('div');
        element.id = info.id;
        element.className = 'todo-task shadow';
        element.draggable = true;
        element.innerHTML = `
        <div class='todo-task-title'>${title}</div>
        <div class='todo-task-des'>${des}</div>
        <div class='todo-task-time'>${time.toLocaleString('vi-vn')}</div>
        <button title='Edit this' class='todo-task-edit'>
            <i class='fas fa-check-circle'></i>
        </button>
        <button title="Delete this" class='todo-task-delete'>
            <i class='fas fa-minus-circle'></i>
        </button>
        `;
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('id', info.id);
        });

        

        return element;
    }

    make_id() {
        const timeStr = (new Date()).getTime().toString();
        const randomStr = (Math.floor(Math.random() * 100)).toString();
        return timeStr + randomStr;
    }
}
