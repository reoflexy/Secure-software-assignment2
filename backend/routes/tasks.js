const express= require('express')
const router = express.Router()

const {login,register,addPost,getPosts,verifyOtp,searchPost,addComment,getComments} = require('../controllers/tasks');
const {authorise} = require('../middlewares/authorise')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/addpost',authorise).post(addPost)
router.route('/addcomment',authorise).post(addComment)
router.route('/posts').get(getPosts)
router.route('/comments').get(getComments)
router.route('/verifyOtp').post(verifyOtp)
router.route('/search').get(searchPost)
//add more routes

module.exports= router