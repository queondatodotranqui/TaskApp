const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const dataError = 'Unable to retrieve data'

// users

app.get('/users', async (req, res)=>{

    try{
        const data = await User.find({})
        return res.send({msg:'Success', data})
    } 
    catch(e){
        return res.status(500).send({msg:dataError, e})
    }
})

app.get('/users/id/:id', async (req, res)=>{
    const _id = req.params.id;

    try{
        const data = await User.findById({_id});
        return res.send({msg:'Success', data});
    } 
    catch(e){
        return res.status(500).send({msg:dataError, e});
    }
})

app.get('/users/name/:name', async (req,res)=>{
    const name = req.params.name;

    try{
        const users = await User.find({name})

        if(users.length === 0){
            return res.status(404).send({msg:'Not found'})
        }
        return res.send({msg:'Success', users})
    } 
    catch(e){
        return res.status(500).send({msg:dataError, e})
    }
})

app.post('/users', async (req, res)=>{
    const data = new User(req.body);

    try{
        await data.save()
        return res.status(201).send({msg:'User created', data})
    } 
    catch(e){
        return res.status(400).send({msg:'Error', e})
    }
})



// tasks

app.get('/tasks', async (req, res)=>{

    try{
        const data = await Task.find({})
        return res.send({msg:'Success', data})
    }
    catch(e){
        return res.status(500).send({msg:dataError, e})
    }
})

app.get('/tasks/state/:completed', async (req, res)=>{

    const state = req.params.completed;

    try{
        const data = await Task.find({completed: state})

        if(data.length === 0){
            return res.status(404).send({msg:'Not found'})
        };
        return res.send({msg:'Success', data})
    } 
    catch(e){
        return res.status(500).send({msg:dataError, e})
    }
})

app.get('/tasks/id/:id', async (req, res)=>{

    const _id = req.params.id;

    try{
        const data = await Task.findById(_id);

        if(data === null){
            return res.status(404).send({msg:'Not found'})
        };
        return res.send({msg:'Success', data})
    } 
    catch(e){
        return res.status(500).send({msg:dataError, e})
    }
}) 


app.post('/tasks', async (req, res)=>{
    const data = new Task(req.body);

    try{
        await data.save();
        return res.status(201).send({msg:'Task created', data})
    }
    catch(e){
        return res.status(400).send({msg:'Cannot create task', e})
    }
})

app.listen(port, ()=>{
    console.log(`Server up in port ${port}`);
})

