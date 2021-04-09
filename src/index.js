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

app.get('/users/name/:name', (req,res)=>{
    const name = req.params.name;

    User.find({name})
        .then((value)=>{
            if(value.length === 0){
                return res.status(404).send({msg:'Not found'})
            }
            return res.send({msg:'Success', value})
        })
        .catch((e)=>{return res.status(500).send({msg:dataError, e})})
})

app.post('/users',(req, res)=>{
    const data = new User(req.body);

    data.save()
        .then((data)=>{return res.send({msg: 'Success',data})})
        .catch((error)=>{
            return res.status(400).send({msg: 'Unable to create user',error}
        )})
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

    Task.find({completed: state})
        .then((value)=>{
            if(value.length === 0){
                return res.status(404).send({msg:'Not found'})
            }
            return res.send({msg:'Success', value})
        })
        .catch((e)=>{res.status(500).send({msg:dataError, e})})
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
        .then((data)=>{return res.send({msg: 'Success!',data})})
        .catch((error)=>{
            return res.status(400).send({msg: 'Unable to create task',error}
        )})
})

app.listen(port, ()=>{
    console.log(`Server up in port ${port}`);
})

