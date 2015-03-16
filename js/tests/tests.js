function executeTests() {
	testAddTask();
	testRemoveTask();
	testAddEmptyTask();
	testCompleteTask();
}

function testAddTask() {
	console.log("Test of adding task");
	
	var anton = new User("Anton", "K", "akobylianskiy");

	var washCarTask = new Task(anton, anton, "wash my car");
	var taskService = new TaskService([]);
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
	
	var taskService = new TaskService([]);
	
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
	var taskService = new TaskService([]);
	
	var emptyTask = new Task(anton, anton, "            ");
	taskService.addTask(emptyTask);
	
	if (taskService._storage.length == 0) {
		console.log("Success");
	} else {
		console.log("Fail");
	}
}

function testCompleteTask() {
	console.log("Test of completing task");
	var anton = new User("Anton", "K", "akobylianskiy");
	var taskService = new TaskService([]);
	
	var washCarTask = new Task(anton, anton, "wash my car");
	taskService.addTask(washCarTask);
	taskService.completeTask(washCarTask);
	
	if (washCarTask.isComplete) {
		console.log("Success");
	} else {
		console.log("Fail");
	}
}

