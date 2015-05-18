angular.module('ToDoApp', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('tasks', {
                url: '/tasks',
                templateUrl: 'views/list.html',
                controller: 'TaskListController'
            })
            .state('editTask', {
                url: '/tasks/:id/edit',
                templateUrl: 'views/edit.html',
                controller: 'TaskEditController'
            });
    }).run(function ($state) {
        $state.go('tasks');
    });