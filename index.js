const express = require('express');
const { getDate } = require('./public/scripts/getDate');


const app = express();
app.use(express.urlencoded());
app.use(express.static('public'));
app.set('view engine', 'ejs');

const tasks = [];
const educationTasks = [];

app.get('/', (req, res) => {
    const date = getDate();

    res.render('index', {plannerType: date, tasks: tasks});
})

app.post('/', (req, res) => {
    const newTask = req.body.task;

    if (req.body.task === '') {
        return;
    }

    if (req.body.addTask === 'education') {
        educationTasks.push(newTask);
        res.redirect('/education');
    } else {
        tasks.push(newTask);
        res.redirect('/');
    }
})

app.get('/education', (req, res) => {
    res.render('index', {plannerType: 'education', tasks: educationTasks});
})


app.listen(process.env.PORT || 3000, () => console.log('The application has been started!'));
