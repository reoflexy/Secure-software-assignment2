const express= require('express')
const router = express.Router()

const {login,register,addPost,getPosts} = require('../controllers/tasks');
const {authorise} = require('../middlewares/authorise')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/addpost',authorise).post(addPost)
router.route('/posts').get(getPosts)
//add more routes

module.exports= router