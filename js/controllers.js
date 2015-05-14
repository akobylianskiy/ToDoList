angular.module('ToDoApp')
    .controller('TaskController', function($scope, TaskService) {
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
    });
