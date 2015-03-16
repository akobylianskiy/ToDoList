toDoListApp = {
	init : function(taskService) {
		$(document).on('task_added', function(event, task) {
			taskService.addTask(task);
		});
		
		$(document).on('taks_deleted', function(event, task) {
			taskService.removeTask(task);
		});
		
		$(document).on('task_completed', function(event, task) {
			taksService.completeTask(task);
		});
		
	}
}