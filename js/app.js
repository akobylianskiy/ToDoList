angular.module('ToDoApp', [])
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    });