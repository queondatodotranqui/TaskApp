const express = require('express');
const router = new express.Router();
const User = require('../models/user');

const dataError = 'Unable to retrieve data'

router.get('/users', async (req, res)=>{

    try{
        const data = await User.find({})
        return res.send({msg:'Success', data})
    } 
    catch(e){
        return res.status(500).send({msg:dataError, e})
    }
})

router.get('/users/id/:id', async (req, res)=>{
    const _id = req.params.id;

    try{
        const data = await User.findById({_id});
        return res.send({msg:'Success', data});
    } 
    catch(e){
        return res.status(500).send({msg:dataError, e});
    }
})

router.get('/users/name/:name', async (req,res)=>{
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


router.post('/users', async (req, res)=>{
    const data = new User(req.body);

    try{
        await data.save()
        return res.status(201).send({msg:'User created', data})
    } 
    catch(e){
        return res.status(400).send({msg:'Error', e})
    }
})


router.patch('/users/:id', async (req, res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'password', 'email'];
    const isValid = updates.every((update)=>allowedUpdates.includes(update));

    if(!isValid){
        return res.status(400).send({msg:'Invalid updates'});
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        })
        
        if(!user){
            return res.status(404).send({msg:'Not found'})
        }
        return res.send({msg:'User updated', user})
    }
    catch(e){
        return res.status(400).send({msg:'Error', e})
    }
})

router.delete('/users/:id', async (req, res)=>{

    try{
        const data = await User.findByIdAndDelete(req.params.id)
        if(!data){
            return res.status(404).send({msg:'Not found'})
        }
        return res.send({msg:'User deleted', data})
    }
    catch(e){
        return res.status(500).send({msg:'Error', e});
    }
})

module.exports = router;