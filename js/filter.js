angular.module('ToDoApp')
    .filter('taskOrderBy', function () {
        return function (arr) {
            arr.sort(function (first, second) {
                if (first.getIsFinished() && !second.getIsFinished()) {
                    return 1;
                }

                if (!first.getIsFinished() && second.getIsFinished()) {
                    return -1;
                }

                return second.getTimestamp() - first.getTimestamp();
            });

            return arr;
        }
    });