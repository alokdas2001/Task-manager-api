const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const { update } = require('../models/task')
const router = new express.Router()  // router should be used if you seperate routers files


//create task 
router.post('/tasks',auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


//read all  task.. /tasks?completed=true/false
// /tasks?limit=10&skip=20
// /tasks?sortBy=createdAT:desc
router.get('/tasks',auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){ // ?completed=true/false value will be stored 
        match.completed = req.query.completed === 'true'
    }  

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1:1
    }

    try {
        await req.user.populate({
            path : 'tasks',
            match ,// get task regarding its completed value
            options:{
                limit: parseInt(req.query.limit) , // limit set by user
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})


//read task by id
router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id , owner:req.user._id})  // find user by id or owner

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

// update task by id
router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)           // typed by the user to update
    const allowedUpdates = ['description', 'completed']     // this are allowed to update
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))  // checkiing if the typed data is in allowedUpdates

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({_id : req.params.id , owner: req.user._id}) // task id

       
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) =>task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


// delete task by id
router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id : req.params.id , owner: req.user._id})  

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router