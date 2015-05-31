angular.module('toDoApp')
    .filter('taskOrderBy', function () {
        return function (arr) {
            arr.sort(function (first, second) {
                if (first.finished && !second.finished) {
                    return 1;
                }

                if (!first.finished && second.finished) {
                    return -1;
                }

                return second.timestamp - first.timestamp;
            });

            return arr;
        }
    });