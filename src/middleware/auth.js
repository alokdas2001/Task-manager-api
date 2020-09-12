const jwt = require('jsonwebtoken');
const User = require('../models/user')

const auth = async (req , res , next) =>{

    try{
        const token = req.header('Authorization').replace('Bearer ' , '')  //stores token user provided
        const decoded = jwt.verify(token , process.env.JWT_SECRET)  // validate the header...nodejscourse is auth key can be anything but same as in models/user GenAuthToken
        const user = await User.findOne({_id:decoded._id , 'tokens.token':token}) // find the user by token

        if(!user){
            throw new Error()
        }

        req.token = token   // adding token to req
        req.user = user  // adding user to req
        next()   // to run router if everyting is working 
    }catch(e){
        res.status(401).send({error : 'please authenticate.'})
    }



   
}

module.exports = auth