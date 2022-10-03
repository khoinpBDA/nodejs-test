const express = require('express')
const router = new express.Router()
const Task = require('../model/task')
const User = require('../model/user')
const auth = require('../middleware/auth')
const  ObjectID = require('mongodb').ObjectId;


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id: new ObjectID(req.params.id), owner: req.user._id})
        if(!task){
            res.status(404).send()
        }
        res.status(200).send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        const match = {}
        const sort = {}
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        if(parseInt(req.query.page)===0){
            req.query.page = 1
        }

        const limit = parseInt(req.query.size)

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        const user = await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit,
                skip: (parseInt(req.query.page) - 1) * limit,
                sort
            }
        })

    
        res.status(200).send(user.tasks)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router