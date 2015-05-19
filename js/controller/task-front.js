angular.module('ToDoApp')
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

            TaskService.addTask(taskInfo);
        };

        $scope.removeTask = function (taskId) {
            TaskService.removeTask(taskId);
        };

        $scope.editPage = function (taskId) {
            $state.go('editTask', {id: taskId});
        };

        $scope.changeState = function (isFinished, taskId) {
            if (isFinished) {
                TaskService.openTask(taskId);
            } else {
                TaskService.finishTask(taskId);
            }
        };

        $scope.state = function (isFinished) {
            if (isFinished) {
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