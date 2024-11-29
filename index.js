//importing dot env file
require('dotenv').config()
require('./DB/connection')
const cors = require('cors')
const router = require('./Routes/router')
//creating express server
const express = require('express')
//creating express application
const server = express()
//including cors
server.use(cors());
server.use(express.json());
server.use(router);
const PORT = 3000 || process.env.PORT
server.listen(PORT,()=>{
    console.log("server started at port",PORT);
})
