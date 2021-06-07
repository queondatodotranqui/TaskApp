const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

const dataError = 'Unable to retrieve data';

router.get('/tasks', auth, async (req, res)=>{

    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed;
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
    
        res.send({msg:`Showing tasks from ${req.user.name}`, tasks:req.user.tasks})
    }
    catch(e){
        return res.status(500).send({msg:'Error', e:dataError});
    }
})

router.get('/tasks/id/:id', auth, async (req, res)=>{

    const _id = req.params.id;

    try{
        const task = await Task.findOne({_id, owner: req.user._id});

        if(task === null){
            return res.status(404).send({msg:'Not found'})
        };
        return res.send({msg:'Success', task})
    } 
    catch(e){
        return res.status(500).send({msg:dataError, e})
    }
}) 

router.post('/tasks', auth, async (req, res)=>{
    const data = new Task({
        ...req.body,
        owner:req.user._id
    });

    try{
        await data.save();
        return res.status(201).send({msg:'Task created', data});
    }
    catch(e){
        return res.status(400).send({msg:'Cannot create task', e});
    }
})


router.patch('/tasks/:id', auth, async (req, res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({msg:'Invalid updates'})
    }

    try{
        const data = await Task.findOne({_id:req.params.id, owner:req.user._id});

        if(!data){
            return res.status(404).send({msg:'Not found'});
        }

        updates.forEach((item)=> data[item] = req.body[item]);

        await data.save();
        return res.send({msg:'Task updated', data});
    }
    catch(e){
        return res.status(400).send({msg:'Error', e});
    }
})

router.delete('/tasks/:id', auth, async (req, res)=>{

    try{
        const data = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id});

        if(!data){
            return res.status(404).send({msg:'Not found'});
        }
        return res.send({msg:'Task deleted', data})
    }
    catch(e){
        return res.status(500).send({msg:'Error', e})
    }
})

module.exports = router;