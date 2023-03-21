const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {pool,config} = require('../db')

const register = async (req,res) => {
    const {username,password,email} = req.body;
    //check user detail are present
    if(!username || !email|| !password){
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
    const token = jwt.sign({user: username,email: email},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXP});
    return res.status(200).send({token: token,message: 'Registration successful', });
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
const q = `set search_path = hotelbooking,public; SELECT * FROM users WHERE username = '${username}'  ;`;

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

//create token and send response
const token = jwt.sign({user: username,email: email},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXP});
return res.status(200).json({token: token,message: 'Registration successful' }); 

})
.catch((err) => {
console.log(err);
return res.status(500).json(err)
})


}



const getPosts = async () => {
const client = await pool.connect();
const q = `set search_path = hotelbooking,public; SELECT * FROM users;`;

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

const addPost = async (message,username,image) => {
    const client = await pool.connect();
    const q = `set search_path = hotelbooking,public;   ;`
    
    }

module.exports = 
{
register,
login,
getPosts,
addPost
}