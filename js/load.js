class LoadData {
    constructor() {
        this.task = {};
    }

    load() {
        this.task = JSON.parse(localStorage.getItem('task')) || {};
    }

    save() {
        localStorage.setItem('task', JSON.stringify(this.task));
    }
}
