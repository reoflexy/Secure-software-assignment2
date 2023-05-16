const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {pool,config} = require('../db')
const nodemailer = require('nodemailer')

const register = async (req,res) => {
    let {username, email,password} = req.body;
    const onlyLettersPattern = /^[A-Za-z]+$/;
    let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let passExpression = /^([a-z]|[A-Z]|[0-9]){4,8}$/;

    //check user detail are present
    if(!username || !password || !email){
    return res.status(500).send('Invalid signup credentials');
    }

    if(!username.match(onlyLettersPattern)){
        return res.status(400).json({ message: "username cannot have special characters or numbers!"})
      }

      if(!email.match(regexEmail)){
        return res.status(400).json({ err: "Invalid email input"})
      }

      if(!password.match(passExpression)){
        return res.status(400).json({ err: "Password must be 8 characters with only letters and numbers"})
      }




    //CREATE salt for password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    //define connection client from pool
    const client = await pool.connect();
    const userId = Math.floor(Math.random() * (199199-002111));

    let regQuery = `set search_path = public; insert into users values('${userId}', '${username}','${email}','${password}',now() );`
   
    //insert user 
    //await client.query(regQuery, [userId], [username],[email],[password],()=>{}).then((result)=> {
        await client.query(regQuery).then((result)=> {
    //create token
    const token = jwt.sign({user: username},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXP});
    return res.status(200).send({token: token,message: 'success',DBResult: result });
    })
    .catch((err)=> {
        console.log(err)
        return res.status(500).send(err);
    })


}

const login = async (req,res) => {
const {username,password} = req.body
    const onlyLettersPattern = /^[A-Za-z]+$/;
    let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let passExpression = /^([a-z]|[A-Z]|[0-9]){4,8}$/;

if(!username || !password){
    return res.status(500).send('Invalid login credentials')
}

if(!username.match(onlyLettersPattern)){
    return res.status(400).json({ message: "username cannot have special characters or numbers!"})
  }


  if(!password.match(passExpression)){
    return res.status(400).json({ err: "Password must be 8 characters with only letters and numbers"})
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
const otpnum = Math.floor(Math.random() * (9991-1911)+1911);
const otpId = Math.floor(Math.random() * (99991-11911)+11911);

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
        pass: 'yqaabsxcykfxwuby'
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
        return res.status(200).json({message: 'success, OTP sent' });
    }
})



})
.catch((err) => {
console.log(err);
return res.status(500).json(err)
})


}

const addPost = async (req,res) => {
    let {message,username} = req.body
    let postExpression = /^([,. ][a-z]|[A-Z]|[0-9]){1,80000}$/;
    const onlyLettersPattern = /^[A-Za-z]+$/;
    let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   

    //validate inputs
    if(!message || !username){
        console.log('Invalid input')
        return res.status(400).json({message: 'Invalid input'})
    }

    if(!username.match(onlyLettersPattern)){
        return res.status(400).json({ err: "Invalid username"})
      }

      message = typeof(message) === 'string' && message.trim().length > 0 ? message.trim() : '';


    //create connection client
    const client = await pool.connect();
    //generate Id for post
    const postId = Math.floor(Math.random() * (31991-01021)+01021);
    //create query string
    const q = `set search_path = public; insert into posts values('${postId}','${username}','${message}',now());`
    //perform asynchronous database insertation
    await client.query(q).then((result)=> {
    console.log('Post successful')
    return res.status(200).json({response: result, message: 'success'});
    }).catch((err)=>{
        console.log('Post failed to upload',err)
        return res.status(500).json({message: 'Post failed'})
    })
    
 }

 const addComment = async (req,res) => {
    let {message,username,postId} = req.body
    const onlyLettersPattern = /^[A-Za-z]+$/;
    let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let passExpression = /^([a-z]|[A-Z]|[0-9]){4,8}$/;

    //validate inputs
    if(!message || !username || !postId){
        console.log('Invalid input')
        return res.status(400).json({message: 'Invalid input'})
    }

    if(!username.match(onlyLettersPattern)){
        return res.status(400).json({ err: "Invalid username"})
      }

      postId = typeof(postId) === 'number' && postId % 1 === 0 ? postId : 0;

      message = typeof(message) === 'string' && message.trim().length > 0 ? message.trim() : '';



    //create connection client
    const client = await pool.connect();
    //generate Id for post
    const commentId = Math.floor(Math.random() * (31991-01021)+01021);
    //create query string
    const q = `set search_path = public; insert into comments values('${commentId}','${username}','${postId}','${message}',now());`
    //perform asynchronous database insertation
    await client.query(q).then((result)=> {
    console.log('Comment successful')
    return res.status(200).json({response: result, message: 'success'});
    }).catch((err)=>{
        console.log('Comment failed to upload',err)
        return res.status(500).json({message: 'Comment failed'})
    })
    
 }

const verifyOtp = async (req,res) => {
let {otp,username} = req.body
const onlyLettersPattern = /^[A-Za-z]+$/;
const onlyNumbersPattern = /^[0-9]+$/;

if(!username.match(onlyLettersPattern)){
    return res.status(400).json({ err: "Invalid username"})
  }

  

//otp = typeof(otp) === 'number' && otp % 1 === 0 ? otp : 0;

otp = typeof(otp) === 'string' && otp.trim().length > 0 ? otp.trim() : '';


const client = await pool.connect();
const q = `set search_path = public; SELECT * FROM otp WHERE username = '${username}' ;`;
const q2 = `set search_path = public; DELETE FROM otp WHERE username = '${username}'  ;`;

//check if otp exists
await client.query(q).then(async(result)=>{
client.release();
let data = result[1].rows
console.log(data)
//check if rows are empty
if (data.length < 1){
    console.log('Doesnt exit')
    return res.status(500).send('OTP not found')
}
data = data[0]
console.log(data)
//compare otp values
if(otp == data.otp){
//delete otp from db
await client.query(q2).then((result) => {
console.log('otp deleted')
})
.catch((err) => {
    console.log('cannot delete otp')
    return res.status(500).json({message: 'Cannot delete otp',error: err });
})
//create token and send response
const token = jwt.sign({user: username},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXP});

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

const searchPost = async(req,res) => {
let params = req.query.search

const client = await pool.connect();
const q = `set search_path = public; SELECT * FROM posts WHERE body like '%${params}%'  ;`;

params = typeof(params) === 'string' && params.trim().length > 0 ? params.trim() : '';

//check if otp exists
await client.query(q).then(async(result)=>{
    client.release();
    let data = result[1].rows
    console.log(data);
    return res.status(200).json({data:data, message: 'success'})
})
.catch((err) => {
    console.log(err);
    return res.status(200).json({data: err, message: 'error'})
})

}

const getPosts = async (req,res) => {
const client = await pool.connect();
const q = `set search_path = public; SELECT * FROM posts;`;

await client.query(q).then((result)=>{
client.release();
let data = result[1].rows
//console.log(data);
return res.status(200).json(data)
})
.catch((err) => {
console.log(err);
return res.status(500).json(err)
})


}

const getComments = async (req,res) => {
    let param = req.query.postId;
    param = typeof(param) === 'string' && param.trim().length > 0 ? param.trim() : '';

    console.log(param);
    const client = await pool.connect();
    const q = `set search_path = public; SELECT * FROM comments WHERE postid = '${param}' ;`;
    
    await client.query(q).then((result)=>{
    client.release();
    let data = result[1].rows
    //console.log(data);
    return res.status(200).json({data: data})
    })
    .catch((err) => {
    console.log(err);
    return res.status(500).json(err)
    })
    
    
    }




module.exports = 
{
register,
login,
getPosts,
addPost,
verifyOtp,
searchPost,
addComment,
getComments
}