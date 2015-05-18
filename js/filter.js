angular.module('ToDoApp')
    .filter('taskOrderBy', function () {
        return function (arr) {
            arr.sort(function (first, second) {
                if (first.isFinished && !second.isFinished) {
                    return 1;
                }

                if (!first.isFinished && second.isFinished) {
                    return -1;
                }

                return second.timestamp - first.timestamp;
            });

            return arr;
        }
    });