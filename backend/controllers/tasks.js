
const {pool,config} = require('../db')

const register = async (req,res) => {
    //check user detail are present
    if(!req.body.username || !req.body.email|| !req.body.password){
    return res.status(500).send('Invalid login credentials');
    }

    const client = await pool.connect();


}

const login = async (username,password) => {

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