angular.module('toDoApp')
    .controller('TaskListController', function ($scope, TaskService, $state) {
        $scope.author = 'Anton';
        $scope.assignee = 'Anton';

        $scope.tasks = function () {
            return TaskService.fetchAll();
        };

        $scope.addTask = function () {
            var taskInfo = {};
            taskInfo.author = $scope.author;
            taskInfo.assignee = $scope.assignee;
            taskInfo.description = $scope.description;

            $scope.description = '';
            $scope.createTask.description.$setPristine();
            TaskService.addTask(taskInfo);
        };

        $scope.removeTask = function (taskId) {
            TaskService.removeTask(taskId);
        };

        $scope.editTask = function (taskId) {
            $state.go('editTask', {id: taskId});
        };

        $scope.changeState = function (finished, taskId) {
            if (finished) {
                TaskService.openTask(taskId);
            } else {
                TaskService.finishTask(taskId);
            }
        };

        $scope.state = function (finished) {
            if (finished) {
                return 'Open';
            }

            return 'Finish';
        };
    })
    .controller('TaskEditController', function ($scope, $state, $stateParams, TaskService) {
        $scope.task = TaskService.getTask(parseInt($stateParams.id));

        $scope.assignee = $scope.task.assignee;
        $scope.description = $scope.task.description;

        $scope.updateTask = function () {
            TaskService.updateTask(parseInt($stateParams.id), $scope.assignee, $scope.description);
            $state.go('tasks');
        };
    });
