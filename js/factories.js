angular.module('ToDoApp')
    .factory('Util', function () {
        return {
            prettyDateString: function (timestamp) {
                var date = new Date(timestamp);
                return date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) +
                    '/' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
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
    })
    .factory('IdGenerator', function () {
        return {
            count: 0,

            initGenerator: function (count) {
                this.count = count;
            },

            generateId: function () {
                this.count = ++this.count;
                return this.count;
            }
        };
    })
    .factory('Task', function (IdGenerator) {
        var Task = function (author, assignee, description) {
            this.id = IdGenerator.generateId();
            this.author = author;
            this.assignee = assignee;
            this.description = description;
            this.isFinished = false;
            this.timestamp = new Date().getTime();
        };

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

        return Task;
    })
    .factory('TaskStorage', function (Task) {
        var TaskStorage = function () {
            this.storageKey = 'tasks';

            if (localStorage.getItem(this.storageKey) === null) {
                localStorage.setItem(this.storageKey, JSON.stringify([]));
            }
        };

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

        return TaskStorage;
    })
    .factory('TaskList', function (Task, TaskStorage, IdGenerator) {
        var TaskList = function (data) {
            var _storage = data;

            if (data.length != 0) {
                var maxId = data[data.length - 1].getId();
                IdGenerator.initGenerator(maxId);
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
        };

        return TaskList;
    })
    .service('TaskService', function (IdGenerator, Task, TaskStorage, TaskList) {
        var taskStorage = new TaskStorage();
        var taskList = new TaskList(taskStorage.fetchAll());

        this.addTask = function (info) {
            var task = new Task(info.author, info.assignee, info.description);
            taskList.add(task);
            var tasks = taskList.fetchAll();
            taskStorage.save(tasks);
        };

        this.removeTask = function (taskId) {
            taskList.remove(taskId);
            var tasks = taskList.fetchAll();
            taskStorage.save(tasks);
        };

        this.finishTask = function (taskId) {
            var task = taskList.getById(taskId);
            task.setIsFinished(true);
            var tasks = taskList.fetchAll();
            taskStorage.save(tasks);
        };

        this.openTask = function (taskId) {
            var task = taskList.getById(taskId);
            task.setIsFinished(false);
            var tasks = taskList.fetchAll();
            taskStorage.save(tasks);
        };

        this.editDescriptionTask = function (taskId, newDescription) {
            var task = taskList.getById(taskId);
            task.setDescription(newDescription);
            var tasks = taskList.fetchAll();
            taskStorage.save(tasks);
        };

        this.fetchAll = function () {
            return taskList.fetchAll();
        }
    });
