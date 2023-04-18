const express= require('express')
const router = express.Router()

const {login,register,addPost,getPosts,verifyOtp,searchPost} = require('../controllers/tasks');
const {authorise} = require('../middlewares/authorise')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/addpost',authorise).post(addPost)
router.route('/posts').get(getPosts)
router.route('/verifyOtp').post(verifyOtp)
router.route('/search',authorise).post(searchPost)
//add more routes

module.exports= router