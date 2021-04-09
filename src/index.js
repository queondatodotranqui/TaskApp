const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// users

app.get('/users', (req, res)=>{
    User.find({})
        .then((value)=>{return res.send(
            {
                msg: 'Success!',
                value
            }
        )})
        .catch((error)=>{
            res.status(500).send({msg: 'Unable to retrieve data'});
        })
})

app.get('/users/id/:id', (req, res)=>{
    const _id = req.params.id;

    User.findById(_id)
        .then((value)=>{
            if(!value){
                return res.status(404).send('Data not found')
            }
            return res.send({msg: 'Success', value})
        })
        .catch((error)=>{
            res.status(500).send({msg: 'Error', error});
        })
})

app.get('/users/name/:name', (req,res)=>{
    const name = req.params.name

    User.findOne({name})
        .then((value)=>{
            if(!value){
                return res.status(404).send({msg: 'Not found'})
            }
            return res.send({msg: 'Success', value});
        })
        .catch((error)=>{
            res.status(400).send(
            {
                msg: 'Unable to retrieve data',
                error
            }
        )})
})

app.post('/users',(req, res)=>{
    const data = new User(req.body)

    data.save()
        .then((data)=>{return res.send(
            {
                msg: 'Success',
                data
            }
        )})
        .catch((error)=>{
            res.status(400).send(
            {
                msg: 'Unable to create user',
                error
            }
        )})
})



// tasks

app.get('/tasks', (req, res)=>{
    Task.find({})
        .then((value)=>{return res.send(
            {
                msg: 'Success!',
                value
            }
        )})
        .catch((error)=>{
            res.status(400).send(
            {
                msg: 'Unable to retrieve data',
                error
            }
        )})
})

app.get('/tasks/state/:completed', (req, res)=>{
    const state = req.params.completed;

    Task.find({completed: state})
        .then((value)=>{
            if(!value){
                return res.status(404).send({msg: 'Not found'})
            }
            return res.send({msg:'Success', value})
        })
        .catch((error)=>{
            return res.status(400).send({msg: 'Error', error});
        })
})

app.get('/tasks/id/:id', (req, res)=>{
    const _id = req.params.id;

    Task.findById(_id)
        .then((value)=>{
            if(!value){
                return res.status(404).send({msg: 'Not found'});
            }
            return res.send({msg: 'Success', value})
        })
        .catch((error)=>{
            return res.status(400).send({msg: 'Unable to retrieve data'})
        })
}) 


app.post('/tasks',(req, res)=>{
    const data = new Task(req.body);

    data.save()
        .then((data)=>{return res.send(
            {
                msg: 'Success!',
                data
            }
        )})
        .catch((error)=>{
            res.status(400).send(
            {
                msg: 'Unable to create task',
                error
            }
        )})
})

app.listen(port, ()=>{
    console.log(`Server up in port ${port}`);
})

