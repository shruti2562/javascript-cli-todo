var fs = require('fs');
const { maxHeaderSize } = require('http');
var todo_file;
var done_file;
var counter;

// init 
function init() {
	if(!fs.existsSync('todo.txt'))
	{
		fs.writeFileSync('todo.txt','');
	}
	if(!fs.existsSync('done.txt'))
	{
		fs.writeFileSync('done.txt','');
	}
	counter = fs.readFileSync('counter.txt', 'utf-8');
}


//display usage
function usage() {
	console.log("Usage :-");
	console.log("./todo add \"todo item\" # Add a new todo");
	console.log("./todo ls              # Show remaining todos");
	console.log("./todo del NUMBER      # Delete a todo");
	console.log("./todo done NUMBER     # Complete a todo");
	console.log("./todo help            # Show usage");
	console.log("./todo report          # Statistics");	
}

//add task
function add(task) {	
	task.forEach((todo, i) => {
		if(counter == 0)
		{
			fs.appendFileSync('todo.txt',todo);
			counter++;
			fs.writeFileSync('counter.txt', counter);
		}
		else
		{
			fs.appendFileSync('todo.txt','\n'+todo);
			counter++;
			fs.writeFileSync('counter.txt', counter);
		}
		console.log("Added todo: \"",todo,"\"");
	});
}

//mark task as done
function done(task){
	if(task < 0 || task >= counter)
	{
		console.log("Error: todo #",task+1,"does not exist.");
	}
	else
	{
		todo_file = fs.readFileSync('todo.txt', 'utf-8');
		var textByLine = todo_file.split("\n");
		var done_task = textByLine.splice(task,1);
		var todayDate = new Date().toISOString().slice(0,10);
		counter--;
		fs.writeFileSync('counter.txt', counter);
		fs.writeFileSync('todo.txt','');
		if(textByLine.length != 0)
		{
			for(var i = 0; i < counter-1; i++)
			{
				fs.appendFileSync('todo.txt', textByLine[i]+'\n');
			}
			fs.appendFileSync('todo.txt', textByLine[i]);
			fs.appendFileSync('done.txt','x ' + todayDate + ' ' + done_task + '\n');
		}
		console.log("Marked todo #",task+1,"as done.")
	}
}

//delete task
function del(task){
	if(task < 0 || task >= counter)
	{
		console.log("Error: todo #",task + 1,"does not exist. Nothing deleted.");
	}
	else
	{
		task.forEach((todo, i) => {
			todo_file = fs.readFileSync('todo.txt', 'utf-8');
			var textByLine = todo_file.split("\n");
			textByLine.splice(todo,1);
			counter--;
			fs.writeFileSync('counter.txt', counter);
			fs.writeFileSync('todo.txt','');
			if(textByLine.length != 0)
			{
				for(var i = 0; i < counter-1; i++)
				{
				fs.appendFileSync('todo.txt', textByLine[i]+'\n');
			}
			fs.appendFileSync('todo.txt', textByLine[i]);
		}
		console.log("Deleted todo #",todo+1);
		});
	}
}

//list all tasks
function ls() {
	if(counter == 0)
	{
		console.log("There are no pending todos!");
	}
	else
	{
		todo_file = fs.readFileSync('todo.txt','utf-8');
		var textByLine = todo_file.split("\n");
		for(var i = counter - 1; i >=0; i--)
		{
			console.log("[",i+1,"]"," ",textByLine[i]);
		}
	}
}

//give report
function report() {
	done_file = fs.readFileSync('done.txt', 'utf-8');
	var textByLine = done_file.split("\n");
	var todayDate = new Date().toISOString().slice(0,10);
	console.log(todayDate," Pending : ",counter," Completed : ",textByLine.length - 1);
}

var command = process.argv[2];
var argument = process.argv[3];
var args = process.argv.slice(3);
init();

switch(command){
	case "add":
		if(argument == undefined)
			console.log("Error: Missing todo string. Nothing added.");
		else
			add(args);
		break;
	case "done":
		if(isNaN(argument))
			console.log("Error: Missing NUMBER for marking todo as done.");
		else
			done(argument-1);
		break;
	case "del":
		if(isNaN(argument))
			console.log("Error: Missing NUMBER for deleting todo.");
		else
		{
			//del(argument-1);
			args.forEach((arg, i)=> {
				args[i] = arg - 1;
			});
			del(args);
		}
		break;
	case "help":
		usage();
		break;
	case "ls":
		ls();
		break;
	case "report":
		report();
		break;
	default:
		usage();
		break;
}
