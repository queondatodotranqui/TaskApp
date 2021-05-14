const express = require('express');
const { findById, update } = require('../models/task');
const router = new express.Router();
const Task = require('../models/task');

const dataError = 'Unable to retrieve data';

router.get('/tasks', async (req, res)=>{

    try{
        const data = await Task.find({})
        return res.send({msg:'Success', data})
    }
    catch(e){
        return res.status(500).send({msg:dataError, e})
    }
})

router.get('/tasks/state/:completed', async (req, res)=>{

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

router.get('/tasks/id/:id', async (req, res)=>{

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

router.post('/tasks', async (req, res)=>{
    const data = new Task(req.body);

    try{
        await data.save();
        return res.status(201).send({msg:'Task created', data});
    }
    catch(e){
        return res.status(400).send({msg:'Cannot create task', e});
    }
})


router.patch('/tasks/:id', async (req, res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({msg:'Invalid updates'})
    }

    try{
        const data = await Task.findById(req.params.id);

        updates.forEach((item)=> data[item] = req.body[item]);

        await data.save();

        if(!data){
            return res.status(404).send({msg:'Not found'});
        }
        return res.send({msg:'Success', data});
    }
    catch(e){
        return res.status(400).send({msg:'Error', e});
    }
})

router.delete('/tasks/:id', async (req, res)=>{

    try{
        const data = await Task.findByIdAndDelete(req.params.id);

        if(!data){
            return res.status(404).send({msg:'Not found'});
        }
        return res.send({msg:'Success', data})
    }
    catch(e){
        return res.status(500).send({msg:'Error', e})
    }
})

module.exports = router;