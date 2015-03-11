function TaskService(storage) {
	this._storage = storage;
}

TaskService.prototype.addTask = function(task) {
	if (task.description.length == 0) {
		return;
	}
	
	var isEmpty = true;
	for (var i = 0; i < task.description.length; i++) {
		if (task.description[i] != ' ') {
			isEmpty = false;
			break;
		}
	}
	
	if (isEmpty) {
		return;
	}
	
	this._storage.push(task);
}

TaskService.prototype.removeTask = function(taskToRemove) {
	for (var i = 0; i < this._storage.length; i++) {
		if (this._storage[i].equals(taskToRemove)) {
			this._storage.splice(i, 1);
			break;
		}
	}
}

TaskService.prototype.getTasks = function() {
	for (var i = 0; i < this._storage.length; i++) {
		console.log(JSON.stringify(this._storage[i]));
	}
}

TaskService.prototype.completeTask = function(task) {
	for (var i = 0; i < this._storage.length; i++) {
		if (this._storage[i].equals(task)) {
			this._storage[i].isComplete = true;
			return;
		}
	}
}

TaskService.prototype.incompleteTask = function(task) {
	for (var i = 0; i < _storage.length; i++) {
		if (this._storage[i].equals(task)) {
			this._storage[i].isComplete = false;
			return;
		}
	}
}
