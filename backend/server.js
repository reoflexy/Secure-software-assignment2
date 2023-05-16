const express = require("express")
const cors = require('cors')
 const csrf = require('csurf')  // for CSRF token creation and validation
const cookieParser  =  require("cookie-parser"); // csurf requires a cookie or session middleware
const bodyParser  =  require("body-parser") // request body handler
const morgan = require("morgan");
require('dotenv').config();
const tasks = require('./routes/tasks')
const app = express();

const port = process.env.PORT || 5000;
var csrfProtection = csrf({ cookie: true })
app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });
app.use('/api/blogsite',tasks);


app.listen(port,()=>{
    console.log("Server is running on port: "+port)
})