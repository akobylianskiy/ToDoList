var assert = unitjs.assert;
var storageKey = 'tasks';

describe('controller', function() {
    it('should add task', function() {
        var eventBus = {};
        var $eventBus = $(eventBus);
        new Widget(eventBus).init();
        var before = JSON.parse(localStorage.getItem(storageKey)).length;
        $eventBus.trigger(Event.TASK_TO_ADD_VIEW, { 'description': 'wash car' } );
        var after = JSON.parse(localStorage.getItem(storageKey)).length;
        assert.equal(before, after - 1);
    });

    it('should delete task', function() {
        var eventBus = {};
        var $eventBus = $(eventBus);
        new Widget(eventBus).init();
        var before = JSON.parse(localStorage.getItem(storageKey)).length;
        $eventBus.trigger(Event.TASK_TO_ADD_VIEW, { 'description': 'wash car' } );
        var tasks = JSON.parse(localStorage.getItem(storageKey));
        var idToRemove = tasks[0].id;
        $eventBus.trigger(Event.TASK_TO_REMOVE_VIEW, { taskId: idToRemove } );
        var after = JSON.parse(localStorage.getItem(storageKey)).length;
        assert.equal(before, after);
    });

    it('should not add empty task', function() {
        var eventBus = {};
        var $eventBus = $(eventBus);
        new Widget(eventBus).init();
        var before = JSON.parse(localStorage.getItem(storageKey)).length;
        $eventBus.trigger(Event.TASK_TO_ADD_VIEW, { 'description': ''} );
        var after = JSON.parse(localStorage.getItem(storageKey)).length;
        assert.equal(after, before);
    });

    it('should not add task that contains only spaces', function() {
        var eventBus = {};
        var $eventBus = $(eventBus);
        new Widget(eventBus).init();
        var before = JSON.parse(localStorage.getItem(storageKey)).length;
        $eventBus.trigger(Event.TASK_TO_ADD_VIEW, { 'description': '                  '} );
        var after = JSON.parse(localStorage.getItem(storageKey)).length;
        assert.equal(after, before);
    });

    it('should change task', function() {
        var eventBus = {};
        var $eventBus = $(eventBus);
        new Widget(eventBus).init();
        var before = JSON.parse(localStorage.getItem(storageKey)).length;
        var initialDescription = 'do homework';
        $eventBus.trigger(Event.TASK_TO_ADD_VIEW, { 'description': initialDescription } );

        var tasks = JSON.parse(localStorage.getItem(storageKey));
        var taskId = 0;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].description === 'do homework') {
                taskId = tasks[i].id;
                break;
            }
        }

        var changedDescription = 'fail homework';
        $eventBus.trigger(Event.TASK_TO_CHANGE_VIEW, { 'description': changedDescription, 'taskId': taskId} );

        tasks = JSON.parse(localStorage.getItem(storageKey));
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id = taskId) {
                assert.equal(changedDescription, tasks[i].description);
            }
        }
    });

    it('should not change description to empty string', function() {
        var eventBus = {};
        var $eventBus = $(eventBus);
        new Widget(eventBus).init();
        var before = JSON.parse(localStorage.getItem(storageKey)).length;
        var initialDescription = 'do homework';
        $eventBus.trigger(Event.TASK_TO_ADD_VIEW, { 'description': initialDescription } );

        var tasks = JSON.parse(localStorage.getItem(storageKey));
        var taskId = 0;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].description === 'do homework') {
                taskId = tasks[i].id;
                break;
            }
        }

        var changedDescription = '';
        $eventBus.trigger(Event.TASK_TO_CHANGE_VIEW, { 'description': changedDescription, 'taskId': taskId} );

        tasks = JSON.parse(localStorage.getItem(storageKey));
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id = taskId) {
                assert.notEqual(changedDescription, tasks[i].description);
            }
        }
    });
});
