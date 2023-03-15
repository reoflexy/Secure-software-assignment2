const express= require('express')
const router = express.Router()

const {login,register,getPosts} = require('../controllers/tasks');

router.route('/posts').get(getPosts)
router.route('/register').post(register)
router.route('/login').post(login)
//add more routes

module.exports= router