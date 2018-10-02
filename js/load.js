class LoadData {
    constructor() {

    }

    load() {
        this.task = JSON.parse(localStorage.getItem('task'));
        this.todo = task.todo;
        this.doing = task.doing;
        this.done = task.done;
    }

    save() {
        localStorage.setItem('task', JSON.stringify(this.task));
    }
}
