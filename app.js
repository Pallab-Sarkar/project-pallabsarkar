const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
const userRoutes = require('./routes/userRoutes.js')

const connectDB = require('./config/connectdb.js')

//database connection
connectDB(DATABASE_URL)

//json
app.use(express.json())

//load routes
app.use("/api/user", userRoutes)

app.listen(port, () =>{
    console.log(`listening at ${port}`)
})
