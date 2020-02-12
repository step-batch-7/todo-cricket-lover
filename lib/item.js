class Item {
  constructor(task, id, isDone) {
    this.task = task;
    this.taskId = id;
    this.isDone = isDone;
  }

  editTask(newTask) {
    this.task = newTask;
  }

  toggleStatus() {
    this.isDone = !this.isDone;
  }

  getId() {
    return this.taskId;
  }
}

module.exports = { Item };
