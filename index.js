const express = require('express');
const app = express();

var mongoose = require('mongoose');
var todos = require('./todos.json')
var bodyParser = require('body-parser');

const port = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/todos');

var db = mongoose.connection;

db.on('error', function(err){
    console.log('Error while connecting to mongodb ...', err);
});

db.on('open', function(){
    console.log('Success connecting to mongodb ...');
});

var todoSchema = mongoose.Schema({
    title: String,
    content: String,
    created: Date,
    updated: Date,
    done: Boolean
});

todoSchema.methods.setDone = function(){
    this.done = true;
    return this.done;
};

todoSchema.pre('save', function(next){
    var currentDate = new Date();
    this.updated = currentDate;

    next();
});

var TodoModel = mongoose.model('Todo', todoSchema);

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }
    console.log(`server is listening on ${port}`)
});

//WebServices 

//Get all todos
app.get('/todos', (request, response) => {
    TodoModel.find({}, function(err, todos){
        if(err){
            response.status(500).send(err);
        } else {
            response.send(todos);
        }
    });
});

//Delete todo by internal id
app.delete('/todo/:id', (request, response) => {
    var todoId = request.params.id;

    TodoModel.find({_id: todoId}, function(err, todos){
        if(err) response.send(500).send(err);
        
        console.log("Fooo ",todos);
        todos[0].remove(function(_err){
            if(err) response.send(500).send(_err);
            response.send(200);
        })
    });
});


//Add todo
app.post('/todo', (request, response) => {
    var _title = request.body.title;
    var _content = request.body.content;
    var _date = request.body.date || new Date();
    var _done = request.body.done || false;

    if(!_title || !_content || !_date){
        response.status(500).send('please provide all information for a new todo');
    }

    var newTodo = TodoModel({
        title: _title,
        content: _content,
        date: _date,
        updated: new Date(),
        done: _done
    });
    
    newTodo.save(function(err){
        if(err) {
            response.send(500).send(err);
        } else {
            response.send(200);
        }
    });
});

//Update Todo by internal id
app.post('/todo/:id', (request, response) => {
    var todoId = request.params.id;

    TodoModel.find({_id: todoId}, function(err, todos){
        if(err) response.send(500).status(err);

        var _title = request.body.title;
        var _content = request.body.content;
        var _date = request.body.date;
        var _done = request.body.done;

        var todoToBeUpdated = todos[0];
        
        todoToBeUpdated.title = _title || todoToBeUpdated.title;
        todoToBeUpdated.content = _content || todoToBeUpdated.content;
        todoToBeUpdated.date = _date || todoToBeUpdated.date;
        todoToBeUpdated.done = _done || todoToBeUpdated.done;

        todoToBeUpdated.save(function(err){
            if(err) response.send(500).status(err);

            response.send(200);
        });
    })
});


/*app.post('/updateTodo/:id', (request, repsonse) => {
	var regInteger = /^\d+$/;
    var isIdNumber = regInteger.test(request.params.id);

    if(!isIdNumber){
        repsonse.status(500).send('id is not numeric!')
     } 

    var todoId = request.params.id;
    var oldTodo = getTodoById(todoId);

    if(!oldTodo){
    	repsonse.status(500).send('no todo with id '+todoId+'.');
    }

    var title = request.body.title || oldTodo.title ;
    var content = request.body.content || oldTodo.content; 
    var date = request.body.date || oldTodo.date;
    var done = request.body.done || oldTodo.done;

	var success = updateTodoById(todoId, {
		"id": oldTodo.id,
		"title": title,
		"content": content,
		"date": date,
		"done": done
	});

	if(success){
		repsonse.send(200);
	} else {
		repsonse.send(500);
	}
});

app.get('/todos', (request, response) => { 
    response.send(todos);
});

app.get('/todo/:id', (request, response) => {
    var regInteger = /^\d+$/;
    var isIdNumber = regInteger.test(request.params.id);

    if(!isIdNumber){
        response.status(500).send('id is not numeric!')
     } 

     var todoId = request.params.id;
     var todo = getTodoById(todoId);

     if(!todo){
        response.status(500).send('can not find todo with id '+todoId+'!');
     } else {
        response.send(todo);
     }
});

app.post('/addTodo', (request, response) => {
    var title = request.body.title;
    var content = request.body.content;
    var date = request.body.date;
    var done = request.body.done || false;

    if(!title || !content || !date){
        response.status(500).send('please provide all information for a new todo');
    }

    var newTodo = createTodo(title, content, date, done);
    todos.push(newTodo);

    response.send(200);
});



function getTodoById(_id){
    for(idx in todos){
        var todo = todos[idx];

        if(todo.id == _id){
            return todo;
        }
    }
    return null;
}

function updateTodoById(_id, newTodo) {
	for(idx in todos){
		var todo = todos[idx];
		if(todo.id == _id) {
			todos[idx] = newTodo;
			return true;
		}
	}
	return false;
}

function createTodo(title, content, date, done){
    var id = todos.length || [];
    id++;

    return {
        "id" : id,
        "title": title,
        "content": content,
        "date": date,
        "done": done
    };
} */


