const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

const dataError = 'Unable to retrieve data'

// post
router.post('/users/login', async (req, res)=>{

    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateToken();
        
        if(!user){
            return res.status(400).send({msg:'Unable to login'});
        }
        return res.send({msg:'Success', user, token});
    }
    catch(e){
        res.status(500).send({msg:'Error', e});
    }
})

router.post('/users', async (req, res)=>{
    const data = new User(req.body);

    try{
        await data.save()
        const token = await data.generateToken();
        return res.status(201).send({msg:'User created', data, token})
    } 
    catch(e){
        return res.status(400).send({msg:'Error', e})
    }
})

router.post('/users/logout', auth, async (req, res)=>{

    try{
        const user = req.user;

        user.tokens = user.tokens.filter((token)=>{
            return token.token !== req.token;
        })

        await user.save();

        return res.send({msg:'Logged out!'});
    }
    catch(e){
        return res.status(500).send({msg:'Error'});
    }
})

router.post('/users/logoutAll', auth, async(req, res)=>{

    try{
        const user = req.user;
        user.tokens = [];

        await user.save();
        return res.status(200).send({msg:'Logged out all sessions'});
    }
    catch(e){
        return res.status(500).send({msg:'Error'});
    }
})


// get
router.get('/users/me', auth,  async (req, res)=>{

    res.send({msg:'Success', data: req.user});
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


// patch
router.patch('/users/me', auth,  async (req, res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'password', 'email'];
    const isValid = updates.every((update)=>allowedUpdates.includes(update));

    if(!isValid){
        return res.status(400).send({msg:'Invalid updates'});
    }

    try{
        updates.forEach((item)=> req.user[item] = req.body[item])
        
        await req.user.save();
        return res.send({msg:'User updated', user: req.user});
    }
    catch(e){
        return res.status(400).send({msg:'Error', e})
    }
})


// delete
router.delete('/users/me', auth, async (req, res)=>{

    try{
        await req.user.remove();
        
        return res.send({msg:'User deleted', user: req.user});
    }
    catch(e){
        return res.status(500).send({msg:'Error', e});
    }
})

module.exports = router;