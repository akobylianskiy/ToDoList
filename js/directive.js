angular.module('toDoApp')
    .directive('tdDescription', function () {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.description = function(modelValue, viewValue) {
                    if (modelValue === undefined || modelValue.length == 0) {
                        return false;
                    }

                    for (var i = 0; i < modelValue.length; i++) {
                        if (modelValue[i] != ' ') {
                            return true;
                        }
                    }

                    return false
                }
            }
        };
    });