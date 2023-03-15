const express = require("express")
const tasks = require('./routes/tasks')
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use('/api/blogsite',tasks);

app.listen(port,()=>{
    console.log("Server is running on port: "+port)
})