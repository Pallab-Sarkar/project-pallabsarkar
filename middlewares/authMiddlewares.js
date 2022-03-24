const jwt = require('jsonwebtoken')
const userModel = require('../models/user.js')

const checkUserAuth = async (req,res, next)=>{
    let token
    const { authorization } = req.headers
    //get token from user
    if (authorization && authorization.startsWith('Bearer')){
        try {
            token = authorization.split(' ')[1]

            //verify token
            const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)

            //get user from token
            req.user = await userModel.findById(userID).select('-password')
            next()

        } catch (error) {
            res.status(401).send({"status":"unauthorized user"})
            }
    }
    if(!token){
        res.status(401).send({"status":"unauthorized user, No token"})
    }
}

module.exports = checkUserAuth