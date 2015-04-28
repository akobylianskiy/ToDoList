var Event = {
    TASK_TO_ADD_VIEW: 'task_to_add_view',
    ADDED_TASK_MODEL: 'added_task_model',
    TASK_TO_REMOVE_VIEW: 'task_to_remove_view',
    REMOVED_TASK_MODEL: 'removed_task_model',
    TASK_TO_FINISH_VIEW: 'task_to_finish_view',
    FINISHED_TASK_MODEL: 'finished_task_model',
    TASK_TO_OPEN_VIEW: 'task_to_open_view',
    OPENED_TASK_MODEL: 'opened_task_model',
    TASK_TO_CHANGE_VIEW: 'task_to_change_view',
    CHANGED_TASK_MODEL: 'changed_task_model',
    UPDATE_VIEW: 'update_view'
};

function Widget(eventBus, widgetUser) {
    var $eventBus = $(eventBus);

    var idGenerator = {
        count: 0,

        initGenerator: function (count) {
            this.count = count;
        },

        generateId: function () {
            this.count = ++this.count;
            return this.count;
        }
    };

    var Util = {
        prettyDateString: function (timestamp) {
            var date = new Date(timestamp);
            return date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) +
                '/' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
        },

        compareTasks: function (first, second) {
            if (first.getIsFinished() && !second.getIsFinished()) {
                return 1;
            }

            if (!first.getIsFinished() && second.getIsFinished()) {
                return -1;
            }

            return second.getTimestamp() - first.getTimestamp();
        },

        isValidDescription: function (description) {
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
    };

    function Task(author, assignee, description) {
        this.id = idGenerator.generateId();
        this.author = author;
        this.assignee = assignee;
        this.description = description;
        this.isFinished = false;
        this.timestamp = new Date().getTime();
    }

    Task.prototype.setId = function (id) {
        this.id = id;
    };

    Task.prototype.getId = function () {
        return this.id;
    };

    Task.prototype.getAuthor = function () {
        return this.author;
    };

    Task.prototype.setAuthor = function (author) {
        this.author = author;
    };

    Task.prototype.getAssignee = function () {
        return this.assignee;
    };

    Task.prototype.setAssignee = function (assignee) {
        this.assignee = assignee;
    };

    Task.prototype.setDescription = function (description) {
        this.description = description;
    };

    Task.prototype.getDescription = function () {
        return this.description;
    };

    Task.prototype.setIsFinished = function (isFinished) {
        this.isFinished = isFinished;
    };

    Task.prototype.getIsFinished = function () {
        return this.isFinished;
    };

    Task.prototype.setTimestamp = function (timestamp) {
        this.timestamp = timestamp;
    };

    Task.prototype.getTimestamp = function () {
        return this.timestamp;
    };

    Task.prototype.toString = function () {
        return this.getId() + " " + this.getAuthor() + " " + this.getAssignee() + " " + this.getDescription() + " " + this.getIsFinished();
    };

    function TaskList(data) {
        var _storage = data;

        if (data.length != 0) {
            var maxId = data[data.length - 1].getId();
            idGenerator.initGenerator(maxId);
        }

        this.add = function (task) {
            _storage.push(task);
        };

        this.remove = function (taskId) {
            for (var i = 0; i < _storage.length; i++) {
                if (taskId === _storage[i].getId()) {
                    _storage.splice(i, 1);
                }
            }
        };

        this.getById = function (taskId) {
            for (var i = 0; i < _storage.length; i++) {
                if (taskId === _storage[i].getId()) {
                    return _storage[i];
                }
            }

            return null;
        };

        this.fetchAll = function () {
            return _storage.slice(0);
        };
    }

    function TaskStorage() {
        this.storageKey = 'tasks';

        if (localStorage.getItem(this.storageKey) === null) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    TaskStorage.prototype.save = function (tasks) {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    };

    TaskStorage.prototype.fetchAll = function () {
        var data = JSON.parse(localStorage.getItem(this.storageKey));
        var tasks = [];

        for (var i = 0; i < data.length; i++) {
            var task = new Task(data[i].author, data[i].assignee, data[i].description);
            task.setId(data[i].id);
            task.setTimestamp(data[i].timestamp);
            task.setIsFinished(data[i].isFinished);

            tasks.push(task);
        }

        return tasks;
    };

    function TaskService(taskList, taskStorage) {
        this.taskList = taskList;
        this.taskStorage = taskStorage;

        var that = this;

        $eventBus.on(Event.ADDED_TASK_MODEL, function (event, data) {
            var assignee = data.assignee;
            var description = data.description;
            var task = new Task(widgetUser, assignee, description);
            that.addTask(task);

            $eventBus.trigger(Event.UPDATE_VIEW, {'tasks': taskList.fetchAll() });
        });

        $eventBus.on(Event.REMOVED_TASK_MODEL, function (event, data) {
            var taskId = data.taskId;
            that.removeTask(taskId);

            $eventBus.trigger(Event.UPDATE_VIEW, {'tasks': taskList.fetchAll() });
        });

        $eventBus.on(Event.OPENED_TASK_MODEL, function (event, data) {
            var taskId = data.taskId;
            that.openTask(taskId);

            $eventBus.trigger(Event.UPDATE_VIEW, {'tasks': taskList.fetchAll() });
        });

        $eventBus.on(Event.FINISHED_TASK_MODEL, function (event, data) {
            var taskId = data.taskId;
            that.finishTask(taskId);

            $eventBus.trigger(Event.UPDATE_VIEW, {'tasks': taskList.fetchAll() });
        });

        $eventBus.on(Event.CHANGED_TASK_MODEL, function (event, data) {
            var taskId = data.taskId;
            var taskDescription = data.description;
            that.editDescriptionTask(taskId, taskDescription);
            $eventBus.trigger(Event.UPDATE_VIEW, {'tasks': taskList.fetchAll() });
        });
    }

    TaskService.prototype.addTask = function (task) {
        this.taskList.add(task);
        var tasks = this.taskList.fetchAll();
        this.taskStorage.save(tasks);
    };

    TaskService.prototype.removeTask = function (taskId) {
        this.taskList.remove(taskId);
        var tasks = this.taskList.fetchAll();
        this.taskStorage.save(tasks);
    };

    TaskService.prototype.finishTask = function (taskId) {
        var task = this.taskList.getById(taskId);
        task.setIsFinished(true);
        var tasks = this.taskList.fetchAll();
        this.taskStorage.save(tasks);
    };

    TaskService.prototype.openTask = function (taskId) {
        var task = this.taskList.getById(taskId);
        task.setIsFinished(false);
        var tasks = this.taskList.fetchAll();
        this.taskStorage.save(tasks);
    };

    TaskService.prototype.editDescriptionTask = function (taskId, newDescription) {
        var task = this.taskList.getById(taskId);
        task.setDescription(newDescription);
        var tasks = this.taskList.fetchAll();
        this.taskStorage.save(tasks);
    };

    TaskService.prototype.printAll = function () {
        var tasks = this.taskList.fetchAll();

        for (var i = 0; i < tasks.length; i++) {
            console.log(tasks[i].toString());
        }
    };

    function Controller() {
        $eventBus.on(Event.TASK_TO_ADD_VIEW, function (event, data) {
            $eventBus.trigger(Event.ADDED_TASK_MODEL, data);
        });

        $eventBus.on(Event.TASK_TO_REMOVE_VIEW, function (event, data) {
            $eventBus.trigger(Event.REMOVED_TASK_MODEL, data);
        });

        $eventBus.on(Event.TASK_TO_CHANGE_VIEW, function (event, data) {
            $eventBus.trigger(Event.CHANGED_TASK_MODEL, data);
        });

        $eventBus.on(Event.TASK_TO_FINISH_VIEW, function (event, data) {
            $eventBus.trigger(Event.FINISHED_TASK_MODEL, data);
        });

        $eventBus.on(Event.TASK_TO_OPEN_VIEW, function (event, data) {
            $eventBus.trigger(Event.OPENED_TASK_MODEL, data);
        });
    }

    function View(widget) {
        var createTaskArea = $('<textarea class="form-control" id="createTaskArea"/>');
        var createTaskAreaLabel = $('<label for="createTaskArea" class="col-sm-2 control-label">Task Description</label>');
        var assignTo = $('<textarea class="form-control" id="assignTo">me</textarea>');
        var assignToLabel = $('<label for="assignTo" class="col-sm-2 control-label">Assign To</label>');
        var createTaskButton = $('<input class="btn btn-success" type="button" value="Create Task" disabled="true"/>');

        createTaskArea.keyup(function () {
            if (Util.isValidDescription(createTaskArea.val()) && Util.isValidDescription(assignTo)) {
                createTaskButton.attr('disabled', false);
            } else {
                createTaskButton.attr('disabled', true);
            }
        });

        assignTo.keyup(function () {
            if (Util.isValidDescription(createTaskArea.val()) && Util.isValidDescription(assignTo.val())) {
                createTaskButton.attr('disabled', false);
            } else {
                createTaskButton.attr('disabled', true);
            }
        });


        var emptyTaskListLabel = $('<h3>Your task list is empty now.</h3>');
        var taskList = $('<ul></ul>');

        widget.append($('<div class="form-group"></div>').append(createTaskAreaLabel.add(createTaskArea)));
        widget.append($('<div class="form-group"></div>').append(assignToLabel.add(assignTo)));
        widget.append($('<div class="form-group"></div>').append($('<div class="col-sm-offset-2 col-sm-10"></div>').append(createTaskButton)));
        widget.append(emptyTaskListLabel);
        widget.append(taskList);

        createTaskButton.on("click", function (event, data) {
            var description = $('#createTaskArea').val();
            var assignee = $('#assignTo').val();
            if (assignee === 'me') {
                assignee = widgetUser;
            }

            createTaskArea.val('');
            $(this).attr('disabled', true);
            $eventBus.trigger(Event.TASK_TO_ADD_VIEW, { 'assignee': assignee, 'description': description });
        });

        $eventBus.on(Event.UPDATE_VIEW, function (event, data) {
            var tasks = data.tasks;
            tasks.sort(Util.compareTasks);
            taskList.empty();

            if (tasks.length == 0) {
                emptyTaskListLabel.show();
            } else {
                emptyTaskListLabel.hide();
            }

            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].getAssignee() === widgetUser) {
                    taskList.append(convertTaskToView(tasks[i]));
                }
            }
        });

        function convertTaskToView(task) {
            var taskView = $('<li></li>');
            var taskEdit = $('<input class="form-control col-lg-1" type="text" hidden="true">');
            taskEdit.attr('id', 'taskEdit' + task.getId());

            var saveEdit = $('<input class="btn btn-success" type="button" value="save" hidden="true" disabled="true"/>');
            saveEdit.attr('id', 'saveEdit' + task.getId());
            var cancelEdit = $('<input class="btn btn-danger" type="button" value="cancel" hidden="true"/>');
            cancelEdit.attr('id', 'cancelEdit' + task.getId());

            saveEdit.on('click', function (event) {
                var editValue = taskEdit.val();
                if (Util.isValidDescription(editValue)) {
                    taskDescription.val(editValue);
                    $eventBus.trigger(Event.TASK_TO_CHANGE_VIEW, { 'description': editValue, 'taskId': task.getId() });
                }

                taskDescription.show();
                taskEdit.hide();
                taskEdit.val('');
                saveEdit.hide();
                cancelEdit.hide();
            });

            taskEdit.keyup(function () {
                var editValue = taskEdit.val();
                if (Util.isValidDescription(editValue)) {
                    saveEdit.attr('disabled', false);
                } else {
                    saveEdit.attr('disabled', true);
                }
            });

            cancelEdit.on('click', function (event) {
                taskDescription.show();
                taskEdit.val('');
                taskEdit.hide();
                saveEdit.hide();
                cancelEdit.hide();
            });

            var time = $('<br><span>' + '// was added: ' + Util.prettyDateString(task.getTimestamp()) + '</span>');
            var taskDescription = $('<span>' + task.toString() + '</span>');
            var removeTaskButton = $('<input class="btn btn-danger" type="button" value="remove" hidden="true"/>');

            var changeStatusButton;
            if (task.getIsFinished()) {
                taskDescription.css("text-decoration", "line-through");
                changeStatusButton = $('<input class="btn btn-primary" type="button" value="open" hidden="true"/>');
                changeStatusButton.on('click', function (event, data) {
                    $eventBus.trigger(Event.TASK_TO_OPEN_VIEW, {'taskId': task.getId() });
                });
            } else {
                changeStatusButton = $('<input class="btn btn-primary" type="button" value="finish" hidden="true"/>');
                changeStatusButton.on('click', function (event, data) {
                    $eventBus.trigger(Event.TASK_TO_FINISH_VIEW, { 'taskId': task.getId() });
                });
            }

            taskDescription = taskDescription.add(removeTaskButton);
            taskDescription = taskDescription.add(changeStatusButton);

            taskDescription.on('click', function (event, data) {
                taskDescription.hide();
                taskEdit.val(task.getDescription());
                taskEdit.show();
                saveEdit.show();
                cancelEdit.show();
                taskEdit.focus();
            });

            taskDescription.on('mouseenter', function () {
                removeTaskButton.show();
                changeStatusButton.show();
            });

            taskDescription.on('mouseleave', function () {
                removeTaskButton.hide();
                changeStatusButton.hide();
            });

            removeTaskButton.on('click', function (event, data) {
                $eventBus.trigger(Event.TASK_TO_REMOVE_VIEW, { 'taskId': task.getId() });
            });


            taskView.append(taskEdit);
            taskView.append(saveEdit);
            taskView.append(cancelEdit);
            taskView.append(taskDescription);
            taskView.append(time);

            return taskView;
        }
    }

    return {
        init: function (widget) {
            var taskStorage = new TaskStorage();
            var taskList = new TaskList(taskStorage.fetchAll());
            var taskService = new TaskService(taskList, taskStorage);
            var controller = new Controller();
            var view = new View(widget);

            $eventBus.trigger(Event.UPDATE_VIEW, { 'tasks': taskList.fetchAll() });
        }
    }

}
$(document).ready(function () {
    var eventBus = {};
    var widget = new Widget(eventBus, 'antonio').init($('#widget'));
});
