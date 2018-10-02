class Task {
    constructor() {
        this.taskLoader = new LoadData();
        this.taskLoader.load();
        this.mdConverter = new showdown.Converter();

        this.task = this.taskLoader.task;

        this.funcRemoveTask = () => {};
        this.funcUpdateTask = () => {};
    }

    getCount() {
        let todoCount = 0;
        let doingCount = 0;
        let doneCount = 0;
        let total = 0;

        for (const task of Object.values(this.task)) {
            ++total;
            switch (task.type) {
                case 'todo': ++todoCount; break;
                case 'doing': ++doingCount; break;
                case 'done': ++doneCount; break;
                default: --total;
            }
        }

        return {todoCount, doingCount, doneCount, total};
    }

    static newTask(info, type = 'todo') {
        const id = this.makeId();
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
        this.taskLoader.save();
    }

    updateTask(id, info) {
        for (const key of Object.keys(info)) {
            this.task[id][key] = info[key];
        }
        this.taskLoader.save();
    }

    removeTask(id) {
        delete this.task[id];
        this.taskLoader.save();
    }

    createElement(info) {
        const title = info.title || 'Title';
        const content = info.content || '';
        const time = info.time || (new Date());

        const element = document.createElement('div');
        element.id = info.id;
        element.className = 'todo-task shadow rounded';
        element.draggable = true;
        element.innerHTML = `
        <div class='todo-task-title'>${title}</div>
        <div class='todo-task-time text-secondary'>
            <i class='fas fa-clock'></i>
            ${time.toLocaleString('vn')}
        </div>
        <details class='todo-task-content'>
            <summary>show content</summary>
            ${this.mdConverter.makeHtml(content)}
        </details>
        <a title='Edit this' class='todo-task-edit text-primary'>
            <i class='fas fa-pen-square'></i>
        </a>
        <a title="Delete this" class='todo-task-delete text-danger'>
            <i class='fas fa-minus-circle'></i>
        </a>
        `;

        element.querySelector('.todo-task-edit').addEventListener('click', () => {
            this.funcUpdateTask(info);
        });

        element.querySelector('.todo-task-delete').addEventListener('click', () => {
            this.funcRemoveTask(info);
        });

        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('id', info.id);
        });

        return element;
    }

    onUpdateTask(func) {
        this.funcUpdateTask = func;
    }

    onRemoveTask(func) {
        this.funcRemoveTask = func;
    }

    static makeId() {
        const timeStr = (new Date()).getTime().toString();
        const randomStr = (Math.floor(Math.random() * 100)).toString();
        return timeStr + randomStr;
    }
}
