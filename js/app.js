//function Task(description) {
//    this._id = generateId();
//    this._description = description;
//    this._isFinished = false;
//
//    this.getId = function() {
//        return this._id;
//    };
//
//    this.setId = function(id) {
//        this._id = id;
//    };
//
//    this.getDescription = function() {
//        return this._description;
//    };
//
//    this.setDescription = function(description) {
//        this._description = description;
//    };
//
//    this.getIsFinished = function() {
//        return this._isFinished;
//    };
//
//    this.setIsFinished = function(isFinished) {
//        this._isFinished = isFinished;
//    }
//}
//
//
//

function compareTasks(first, second) {
    if (first.getIsFinished() && !second.getIsFinished()) {
        return 1;
    }

    if (!first.getIsFinished() && second.getIsFinished()) {
        return -1;
    }

    return second.getTimestamp() - first.getTimestamp();
}

function generateId() {
    generateId.count = ++generateId.count || 1;
    return generateId.count;
}

function prettyDateString(timestamp) {
    var date = new Date(timestamp);
    return date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
}

function isValidDescription(description) {
    if (description.length == 0) {
        return false;
    }

    for (var i = 0; i < description.length; i++) {
        if (description[i] != ' ') {
            return true;
        }
    }

    return false
}

var eventBus = {};

var Event = {
    TASK_TO_ADD_VIEW: 'task_to_add_view',
    TASK_TO_ADD_MODEL: 'task_to_add_model',
    ADDED_TASK_MODEL: 'added_task_model',
    TASK_TO_REMOVE_VIEW: 'task_to_remove_view',
    TASK_TO_REMOVE_MODEL: 'task_to_remove_model',
    REMOVED_TASK_MODEL: 'removed_task_model',
    TASK_TO_FINISH_VIEW: 'task_to_finish_view',
    TASK_TO_FINISH_MODEL: 'task_to_finish_model',
    FINISHED_TASK_MODEL: 'finished_task_model',
    TASK_TO_OPEN_VIEW: 'task_to_open_view',
    TASK_TO_OPEN_MODEL: 'task_to_open_model',
    OPENED_TASK_MODEL: 'opened_task_model',
    TASK_TO_CHANGE_VIEW: 'task_to_change_view',
    TASK_TO_CHANGE_MODEL: 'task_to_change_model',
    CHANGED_TASK_MODEL: 'changed_task_model',
    UPDATE_VIEW: 'update_view'
};

function Task(description) {
    this.id = generateId();
    this.description = description;
    this.isFinished = false;
    this.timestamp = new Date().getTime();
}

Task.prototype.setId = function(id) {
    this.id = id;
};

Task.prototype.getId = function() {
    return this.id;
};

Task.prototype.setDescription = function(description) {
    this.description = description;
};

Task.prototype.getDescription = function() {
    return this.description;
};

Task.prototype.setIsFinished = function(isFinished) {
    this.isFinished = isFinished;
};

Task.prototype.getIsFinished = function() {
    return this.isFinished;
};

Task.prototype.setTimestamp = function(timestamp) {
    this.timestamp = timestamp;
};

Task.prototype.getTimestamp = function() {
    return this.timestamp;
};

Task.prototype.toString = function() {
    return this.getId() + " " + this.getDescription() + " " + this.getIsFinished();
};


//function TaskList() {
//    var _storage = [];
//
//    this.add = function (task) {
//        _storage.push(task);
//    };
//
//    this.remove = function (taskId) {
//        for (var i = 0; i < _storage.length; i++) {
//            if (taskId === _storage[i].getId()) {
//                _storage.splice(i, 1);
//            }
//        }
//    };
//
//    this.getById = function (taskId) {
//        for (var i = 0; i < _storage.length; i++) {
//            if (taskId === _storage[i].getId()) {
//                return _storage[i];
//            }
//        }
//
//        return null;
//    };
//
//    this.fetchAll = function () {
//        return _storage.slice(0);
//    };
//}

function TaskStorage() {
//    localStorage.clear();
}

TaskStorage.prototype.add = function(task) {
    localStorage.setItem(task.getId(), JSON.stringify(task));
};

TaskStorage.prototype.remove = function(taskId) {
    localStorage.removeItem(taskId);
};

TaskStorage.prototype.fetchAll = function() {
    var tasks = [];
    var keys = Object.keys(localStorage);
    console.log(localStorage);
    for (var i = 0; i < keys.length; i++) {
        var taskDto = JSON.parse(localStorage.getItem(keys[i]));
        var task = this.dtoToEntity(taskDto);
        tasks.push(task);
    }

    return tasks;
};

TaskStorage.prototype.dtoToEntity = function(taskDto) {
    var task = new Task(taskDto.description);
    task.setId(taskDto.id);
    task.setIsFinished(taskDto.isFinished);
    task.setTimestamp(taskDto.timestamp);

    return task;
};

TaskStorage.prototype.printAll = function() {
    var tasks = this.fetchAll();

    for (var i = 0; i < tasks.length; i++) {
        console.log(tasks[i]);
    }
};

TaskStorage.prototype.getById = function(id) {
    var taskDto = JSON.parse(localStorage.getItem(id));
    return this.dtoToEntity(taskDto);
};

TaskStorage.prototype.edit = function(task) {
    localStorage.setItem(task.getId(), JSON.stringify(task));
};

function TaskService(taskList) {
    this.taskList = taskList;

    var that = this;

    $(eventBus).on(Event.ADDED_TASK_MODEL, function(event, data) {
        var description = data.description;
        var task = new Task(description);
        that.addTask(task);

        $(eventBus).trigger(Event.UPDATE_VIEW, {'tasks': taskList.fetchAll() } );
    });

    $(eventBus).on(Event.REMOVED_TASK_MODEL, function(event, data) {
        var taskId = data.taskId;
        that.removeTask(taskId);

        $(eventBus).trigger(Event.UPDATE_VIEW, {'tasks': taskList.fetchAll() } );
    });

    $(eventBus).on(Event.OPENED_TASK_MODEL, function(event, data) {
        var taskId = data.taskId;
        that.openTask(taskId);

        $(eventBus).trigger(Event.UPDATE_VIEW, {'tasks': taskList.fetchAll() } );
    });

    $(eventBus).on(Event.FINISHED_TASK_MODEL, function(event, data) {
        var taskId = data.taskId;
        that.finishTask(taskId);

        $(eventBus).trigger(Event.UPDATE_VIEW, {'tasks': taskList.fetchAll() } );
    });

    $(eventBus).on(Event.CHANGED_TASK_MODEL, function(event, data) {
        var taskId = data.taskId;
        var taskDescription = data.description;
        that.editDescriptionTask(taskId, taskDescription);
        $(eventBus).trigger(Event.UPDATE_VIEW, {'tasks': taskList.fetchAll() } );
    });
}

TaskService.prototype.addTask = function (task) {
    this.taskList.add(task);
};

TaskService.prototype.removeTask = function (taskId) {
    this.taskList.remove(taskId);
};

TaskService.prototype.finishTask = function (taskId) {
    var task = this.taskList.getById(taskId);
    task.setIsFinished(true);
    this.taskList.edit(task);
};

TaskService.prototype.openTask = function(taskId) {
    var task = this.taskList.getById(taskId);
    task.setIsFinished(false);
    this.taskList.edit(task);
};

TaskService.prototype.editDescriptionTask = function(taskId, newDescription) {
    var task = this.taskList.getById(taskId);
    task.setDescription(newDescription);
    this.taskList.edit(task);
};

TaskService.prototype.printAll = function() {
    var tasks = this.taskList.fetchAll();

    for (var i = 0; i < tasks.length; i++) {
        console.log(tasks[i].toString());
    }
};

function Controller() {
    $(eventBus).on(Event.TASK_TO_ADD_VIEW, function(event, data) {
        var description = data.description;
        $(eventBus).trigger(Event.ADDED_TASK_MODEL, { 'description' : description } );
    });

    $(eventBus).on(Event.TASK_TO_REMOVE_VIEW, function(event, data) {
        $(eventBus).trigger(Event.REMOVED_TASK_MODEL, data);
    });

    $(eventBus).on(Event.TASK_TO_CHANGE_VIEW, function(event, data) {
        $(eventBus).trigger(Event.CHANGED_TASK_MODEL, data);
    });

    $(eventBus).on(Event.TASK_TO_FINISH_VIEW, function(event, data) {
        $(eventBus).trigger(Event.CHANGED_TASK_MODEL, data);
    });

    $(eventBus).on(Event.TASK_TO_OPEN_VIEW, function(event, data) {
        $(eventBus).trigger(Event.OPENED_TASK_MODEL, data);
    });
}

function View() {
    var widget = $('#widget');
    var createTaskArea = $('<textarea id="createTaskArea"/><br>');
    var createTaskButton = $('<input type="button" value="Create Task" disabled="true"/>');

    createTaskArea.keyup(function() {
        if (isValidDescription(createTaskArea.val())) {
            createTaskButton.attr('disabled', false);
        } else {
            createTaskButton.attr('disabled', true);
        }
    });

    var emptyTaskListLabel = $('<h3>Your task list is empty now.</h3>');
    var taskList = $('<ul></ul>');

    widget.append(createTaskArea);
    widget.append(createTaskButton);
    widget.append(emptyTaskListLabel);
    widget.append(taskList);

    createTaskButton.on("click", function(event, data) {
        var description = $('#createTaskArea').val();
        createTaskArea.val('');
        $(this).attr('disabled', true);
        $(eventBus).trigger(Event.TASK_TO_ADD_VIEW, { 'description': description } );
    });

    $(eventBus).on(Event.UPDATE_VIEW, function(event, data) {
        var tasks = data.tasks;
        tasks.sort(compareTasks);
        taskList.empty();

        if (tasks.length == 0) {
            emptyTaskListLabel.show();
        } else {
            emptyTaskListLabel.hide();
        }

        for (var i = 0; i < tasks.length; i++) {
            taskList.append(convertTaskToView(tasks[i]));
        }
    });
}

function convertTaskToView(task) {
    var taskView = $('<li></li>');
    var taskEdit = $('<input type="text" hidden="true">');
    taskEdit.attr('id', 'taskEdit' + task.getId());

    var saveEdit = $('<input type="button" value="save" hidden="true" disabled="true"/>');
    saveEdit.attr('id', 'saveEdit' + task.getId());
    var cancelEdit = $('<input type="button" value="cancel" hidden="true"/>');
    cancelEdit.attr('id', 'cancelEdit' + task.getId());

    saveEdit.on('click', function(event) {
        var editValue = taskEdit.val();
        if (isValidDescription(editValue)) {
            taskDescription.val(editValue);
            $(eventBus).trigger(Event.TASK_TO_CHANGE_VIEW, { 'description' : editValue, 'taskId' : task.getId() } );
        }

        taskDescription.show();
        taskEdit.hide();
        taskEdit.val('');
        saveEdit.hide();
        cancelEdit.hide();
    });

    taskEdit.keyup(function() {
        var editValue = taskEdit.val();
        if (isValidDescription(editValue)) {
            saveEdit.attr('disabled', false);
        } else {
            saveEdit.attr('disabled', true);
        }
    });

    cancelEdit.on('click', function(event) {
        taskDescription.show();
        taskEdit.val('');
        taskEdit.hide();
        saveEdit.hide();
        cancelEdit.hide();
    });

    var time = $('<br><span>' + '// was added: ' + prettyDateString(task.getTimestamp()) + '</span>');
    var taskDescription = $('<span>' + task.getDescription() + '</span>');
    var removeTaskButton = $('<input type="button" value="remove" hidden="true"/>');

    var changeStatusButton;
    if (task.getIsFinished()) {
        taskDescription.css("text-decoration", "line-through");
        changeStatusButton = $('<input type="button" value="open" hidden="true"/>');
        changeStatusButton.on('click', function(event, data) {
            $(eventBus).trigger(Event.OPENED_TASK_MODEL, {'taskId': task.getId() } );
        });
    } else {
        changeStatusButton = $('<input type="button" value="finish" hidden="true"/>');
        changeStatusButton.on('click', function(event, data) {
            $(eventBus).trigger(Event.FINISHED_TASK_MODEL, { 'taskId': task.getId() } );
        });
    }

    taskDescription = taskDescription.add(removeTaskButton);
    taskDescription = taskDescription.add(changeStatusButton);

    taskDescription.on('click', function(event, data) {
        taskDescription.hide();
        taskEdit.show();
        saveEdit.show();
        cancelEdit.show();
        taskEdit.focus();
    });

    taskDescription.on('mouseenter', function() {
        removeTaskButton.show();
        changeStatusButton.show();
    });

    taskDescription.on('mouseleave', function() {
        removeTaskButton.hide();
        changeStatusButton.hide();
    });

    removeTaskButton.on('click', function(event, data) {
        $(eventBus).trigger(Event.REMOVED_TASK_MODEL, { 'taskId': task.getId() } );
    });

    taskView.append(taskEdit);
    taskView.append(saveEdit);
    taskView.append(cancelEdit);
    taskView.append(taskDescription);
    taskView.append(time);

    return taskView;
}

$(document).ready(function() {
    var taskList = new TaskStorage();
    var taskService = new TaskService(taskList);
    var controller = new Controller();
    var view = new View();

    $(eventBus).trigger(Event.UPDATE_VIEW, { 'tasks': taskList.fetchAll() } );
});
