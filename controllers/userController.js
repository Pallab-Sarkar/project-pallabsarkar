const userModel = require('../models/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController{
    static userRegistration = async (req,res)=>{
        const {name, email, password, password_confirmation, tc} = req.body
        const user = await userModel.findOne({email: email})
        if(user){
            res.send({"status":"failed", "message":"Email already exists"})
        } else{
            if(name && email && password && password_confirmation && tc){
                if(password === password_confirmation){
                   try {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt)
                    const doc = new userModel({
                        name: name,
                        email: email,
                        password: hashPassword,
                        tc: tc
                    })
                    await doc.save()
                    const saved_user = await userModel.findOne({email: email})
                    //Generate JWT token
                    const token = jwt.sign({userID: saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '5d'})
                    res.status(201).send({"status":"success", "message":"Registration success", "token": token})
                   } catch (error) {
                       res.send({"status":"failed", "message":"unable to register"})
                   }
                } else{
                    res.send({"status":"failed", "message":"password not matched"})
                }
            }else{
                res.send({"status":"failed", "message":"all fields required"})
            }
        }
    }
    static userLogin = async (req,res)=>{
        try {
            const {email, password} = req.body
            if(email && password){
                const user = await userModel.findOne({email: email})
                if(user != null){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if((user.email === email) && isMatch){
                        //generate jwt token
                        const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '5d'})
                        res.send({"status":"success", "message":"Login success", "token": token})
                    }else{
                        res.send({"status":"failed", "message":"Email or password not valid"})
                    }
                }else{
                    res.send({"status":"failed", "message":"you are not a registered user"})
                }
            }else{
                res.send({"status":"failed", "message":"all fields required"})
            }
        } catch (error) {
            console.log(error)
            res.send({"status":"failed", "message":"Unable to login"})
        }
    }
    static changeUserPassword = async (req, res)=>{
        const {password, password_confirmation} = req.body
        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"status":"failed", "message":"New password and confirm New password doesn't match"})
            } else{
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
                await userModel.findByIdAndUpdate(req.user._id, {$set: {password: newHashPassword}})
                res.send({"status":"success", "message":"password changed successfully"})
            }
        } else{
            res.send({"status":"failed", "message":"All fields required"})
        }
    }
    static loggedUserData = async (req,res)=>{
        res.send({"user": req.user})
    }
}
module.exports = UserController