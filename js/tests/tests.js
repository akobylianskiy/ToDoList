function executeTests() {
	testAddTask();
	testRemoveTask();
	testAddEmptyTask();
}

function testAddTask() {
	console.log("Test of adding task");
	
	var anton = new User("Anton", "K", "akobylianskiy");

	var washCarTask = new Task(anton, anton, "wash my car");

	var taskList = new TaskList();
	var taskService = new TaskService(taskList.tasks);
	
	taskService.addTask(washCarTask);
	if (taskService._storage.length == 1) {
		console.log("Success");
	} else {
		console.log("Fail");
	}
}

function testRemoveTask() {
	console.log("Test of removing task");
	
	var anton = new User("Anton", "K", "akobylianskiy");
	var washCarTask = new Task(anton, anton, "wash my car");;
	
	var taskList = new TaskList();
	var taskService = new TaskService(taskList.tasks);
	
	taskService.addTask(washCarTask);
	taskService.removeTask(washCarTask);
	if (taskService._storage.length == 0) {
		console.log("Success");
	} else {
		console.log("Fail");
	}
}

function testAddEmptyTask() {
	console.log("Test of adding empty task");
	var anton = new User("Anton", "K", "akobylianskiy");
	var taskList = new TaskList();
	var taskService = new TaskService(taskList.tasks);
	
	var emptyTask = new Task(anton, anton, "            ");
	taskService.addTask(emptyTask);
	
	if (taskService._storage.length == 0) {
		console.log("Success");
	} else {
		console.log("Fail");
	}
}

