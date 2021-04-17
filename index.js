const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');

// Express configuration

const app = express();
app.use(express.urlencoded());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Mongodb configuration

mongoose.connect('mongodb+srv://vladimiristomin:HigherSchool2020!@todolist.xpdaq.mongodb.net/Tasks?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});

const taskSchema = mongoose.Schema({
    name: String
});

const Task = mongoose.model('Task', taskSchema);

const taskListSchema = mongoose.Schema({
    name: String,
    tasks: [taskSchema]
});

const TaskList = mongoose.model('List', taskListSchema);


async function createBasicTasks(listName) {
    const task1 = new Task({name: "Click + to add new task"});
    const task2 = new Task({name: "<-- Click here to delete the task"});
    const task3 = new Task({name: "Finally, plan your day!"});
    const tasks = [task1, task2, task3];
    const taskList = new TaskList({name: listName, tasks});
    await taskList.save();
    return
}


app.get('/', (req, res) => {
    const listName = 'Today';

    TaskList.findOne({name: listName}, async (err, list) => {
        if (!list) {
            await createBasicTasks(listName)
            res.redirect('/');
        } else {
            res.render('index', {listName, tasks: list.tasks});
        }        
    });
});

app.get('/:anotherList', (req, res) => {
    const listName = _.capitalize(req.params.anotherList);

    TaskList.findOne({name: listName}, async (err, list) => {
        if (!list) {
            await createBasicTasks(listName);
            res.redirect(`/${listName}`);
        } else {
            res.render('index', {listName, tasks: list.tasks})
        }
    });

});

app.post('/', (req, res) => {
    let newTask = req.body.task;

    if (req.body.task === '') {
        return;
    }

    newTask = new Task({name: newTask});

    const listName = req.body.listName;

    if (listName === 'Today') {
        TaskList.findOne({name: 'Today'}, async (err, list) => {
            list.tasks.push(newTask);
            await list.save();
            res.redirect('/');
        });
    } else {
        TaskList.findOne({name: listName}, async (err, list) => {
            list.tasks.push(newTask);
            await list.save();
            res.redirect(`/${listName}`);
        });
    }
});

app.post('/delete', (req, res) => {
    const listName = req.body.listName;
    const taskId = req.body.taskId;

    TaskList.findOneAndUpdate({name: listName}, {$pull: {tasks: {_id: taskId}}}, (err, list) => {
        if (!err) {
            res.redirect(`/${listName}`);
        }
    });
});


app.listen(process.env.PORT || 3000, () => console.log('The application has been started!'));
