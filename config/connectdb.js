const mongoose = require('mongoose')

const connectDB = async (DATABASE_URL) =>{
    try{
        const DB_OPTIONS = {
            dbName: "pallabdb"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log('connected to db')
    } catch (error){
        console.log(error)
    }
}
module.exports = connectDB