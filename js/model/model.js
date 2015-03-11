function User(name, surname, nickname) {
	this.name = name;
	this.surname = surname;
	this.nickname = nickname;
}

User.prototype.equals = function(other) {
	return this.name === other.name &&
		   this.surname === other.surname &&
		   this.nickname === other.nickname;
}

function Task(perfomerUser, creatorUser, description) {
	this.perfomerUser = perfomerUser;
	this.creatorUser = creatorUser;
	this.description = description;
	this.isComplete = false;
}

Task.prototype.equals = function(other) {
	return this.perfomerUser.equals(other.perfomerUser) &&
		   this.creatorUser.equals(other.creatorUser) &&
		   this.description === other.description &&
		   this.isComplete === other.isComplete;
}

function TaskList() {
	this.tasks = [];
}




