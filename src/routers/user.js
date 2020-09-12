const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail , sendCancelationEmail} = require('../emails/account')  // importing both functions
const router = new express.Router()


//create user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        await user.save()
        sendWelcomeEmail(user.email , user.name)  // sending welcome Email
        res.status(201).send({user , token})
    } catch (e) {
        res.status(400).send(e)
    }
})


// User login
router.post('/users/login' , async(req , res)=>{
    try{
        const user = await User.findUser(req.body.email , req.body.password)  // finUser funct in models/user.js
        const token = await user.generateAuthToken()
        res.send({user, token})  // displaying token and user
    }
    catch(e){
        res.status(400).send('Unable to login')
        
    }
})


// User logout

router.post('/users/logout' ,auth ,  async(req, res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token) =>{   // filtering specific token
            return token.token !== req.token  // req.token means latest token generated
        })
        await req.user.save()   // saving the user

        res.send()  //sending the data
    }catch(e){
        res.status(500).send()
    }
})


//User logout from all devices

router.post('/users/logoutAll' , auth , async(req,res)=>{
    try{
        req.user.tokens = []   // removing all tokens at once....logging out of all devices
        await req.user.save()     // saving the user
        res.send()      //sending the data
    }
    catch(e){
        res.status(500).send()
    }

})

// read  user profile by token
router.get('/users/me',auth ,  async (req, res) => {  // auth means auth middleware...before executing router
  res.send(req.user)
})

//update user
router.patch('/users/me', auth , async (req, res) => {
    const updates = Object.keys(req.body)           // typed by the user to update
    const allowedUpdates = ['name', 'email', 'password', 'age']    // this are allowed to update
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))  // checkiing if the typed data is in allowedUpdates

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])  // updating takes place 
        await req.user.save()  // saving the data
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete user by id
router.delete('/users/:me',auth ,  async (req, res) => {
    try {
        await req.user.remove()  // removing user 
        sendCancelationEmail(req.user.email , req.user.name)  // sending cancelation Email
        res.send(req.user)      // sending the data of the user which was deleted
    } catch (e) {
        res.status(500).send()
    }
})

// verification of thing user uploaded
const upload = multer({

    limits:{
        fileSize:1000000  // 1 mega byte
    },
    fileFilter(req,file , cb){  // filter the  files by file types
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){  // this formats only supported
            cb(new Error('File Format Not supported'))
        }
        cb(undefined , true)
    }
})


// upload users avatar
router.post('/users/me/avatar' , auth , upload.single('avatar') , async(req , res) =>{
    const buffer = await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer()  // req.file.buffer is original file details 
    req.user.avatar = buffer  // adding the modified pic to upload
    await req.user.save()
    res.send()
}, (error , req , res , next) =>{
    res.status(400).send({error:error.message})
})

// delete users avatar
router.delete('/users/me/avatar' , auth , upload.single('avatar') , async(req , res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error , req , res , next) =>{
    res.status(400).send({error:error.message})
})


// getting url for users avatar
router.get('/users/:id/avatar' , async (req , res) =>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error ()
        }

        res.set('Content-Type' , 'image/png')
        res.send(user.avatar )
    }
    catch(e){
        res.status(400).send()
    }
})

module.exports = router