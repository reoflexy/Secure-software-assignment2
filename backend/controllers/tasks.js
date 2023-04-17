const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {pool,config} = require('../db')
const nodemailer = require('nodemailer')

const register = async (req,res) => {
    let {username,password} = req.body;
    //check user detail are present
    if(!username || !password){
    return res.status(500).send('Invalid login credentials');
    }

    //CREATE salt for password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    //define connection client from pool
    const client = await pool.connect();
    const userId = Math.floor(Math.random(199199-002111)+002111);

    let regQuery = `set search_path = public; insert into users values('${userId}', '${username}','${password}',now() );`

    //insert user 
    await client.query(regQuery).then((result)=> {
    //create token
    const token = jwt.sign({username: username,userId: userId},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXP});
    return res.status(200).send({token: token,message: 'Registration successful',DBResult: result });
    })
    .catch((err)=> {
        return res.status(500).send(err);
    })


}

const login = async (req,res) => {
const {username,password} = req.body

if(!username || !password){
    return res.status(500).send('Invalid login credentials')
}

//fetch credentials from database
const client = await pool.connect();
const q = `set search_path = public; SELECT * FROM users WHERE username = '${username}'  ;`;

await client.query(q).then(async(result)=>{
client.release();
let data = result[1].rows
console.log(data)
//check if rows are empty
if (data.length < 1){
    console.log('No user with these credentials')
    return res.status(500).send('Invalid login credentials')
}
data = data[0]

//compare passwords
const isMatch = await bcrypt.compare(password, data.password)
if (!isMatch){
    console.log('Invalid login credentials')
    return res.status(500).send('Invalid login credentials')
}

//create otp data
const otpnum = Math.floor(Math.random(9991-1911)+1911);
const otpId = Math.floor(Math.random(99991-11911)+11911);

//save otp to db
const q2 = `set search_path = public; INSERT INTO otp VALUES ('${otpId}','${data.username}','${otpnum}',now() ) ;`;
await client.query(q2).then((result)=>{
console.log('otp saved')
})
.catch((err) => {
    console.log(err);
    return res.status(500).json(err)
})

//send email otp
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'richmondeyesan04@gmail.com',
        pass: 'qw12aszx17091996'
    }
    });


const mailOptions = {
from: 'My Blog',
to: `${data.email}`,
subject: 'Verify Your Identity',
text: 'Hi '+data.username+' , enter the code: '+otpnum+' to verify your account'
}

await transporter.sendMail(mailOptions, function(error,info){
    if(error){
        console.log(error);
        return res.status(500).json(error)
    }
    else{
        console.log('Email sent')
        return res.status(200).json({message: 'success' });
    }
})



})
.catch((err) => {
console.log(err);
return res.status(500).json(err)
})


}

const addPost = async (req,res) => {
    const {message,username} = req.body

    //validate inputs
    if(!message || username){
        console.log('Invalid input')
        return res.status(400).json({message: 'Invalid input'})
    }
    //create connection client
    const client = await pool.connect();
    //generate Id for post
    const postId = Math.floor(Math.random(3199199-0102111)+0102111);
    //create query string
    const q = `set search_path = hotelbooking,public; insert into posts values('${postId},'${username}','${message}',now()) ;`
    //perform asynchronous database insertation
    await client.query(q).then((result)=> {
    console.log('Post successful')
    return res.status(200).json({response: result, message: 'Post successful'});
    }).catch((err)=>{
        console.log('Post failed ',err)
        return res.status(500).json({message: 'Post failed'})
    })
    
 }

const verifyOtp = async (req,res) => {
const {otp,user} = req.body

const client = await pool.connect();
const q = `set search_path = public; SELECT * FROM otp WHERE username = '${user.username}'  ;`;


//check if otp exists
await client.query(q).then(async(result)=>{
client.release();
let data = result[1].rows
console.log(data)
//check if rows are empty
if (data.length < 1){
    console.log('Invalid otp')
    return res.status(500).send('Invalid OTP')
}
data = data[0]

//compare otp values
if(otp == data.otp){
//create token and send response
const token = jwt.sign({user: user},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXP});
return res.status(200).json({token: token,message: 'success' });
}
else {
    console.log('Invalid OTP')
    return res.status(500).json({message: 'Invalid otp' });
}
})
.catch((err) => {
console.log(err)
return res.status(500).json({message: 'Verification Failed',error: err});
})

 }



const getPosts = async () => {
const client = await pool.connect();
const q = `set search_path = hotelbooking,public; SELECT * FROM posts;`;

await client.query(q).then((result)=>{
client.release();
let data = result[1].rows
console.log(data);
res.json(data)
})
.catch((err) => {
console.log(err);
})


}



module.exports = 
{
register,
login,
getPosts,
addPost,
verifyOtp
}