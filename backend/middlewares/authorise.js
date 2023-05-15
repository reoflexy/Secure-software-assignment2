const jwt = require('jsonwebtoken')

const authorise = async(req,res,next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
    console.log('Unauthorised request')
    return res.status(403).json({message: 'Unauthorised request'})
    }

    let token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.username = {username: payload.user}
        next()
    } catch (error) {
        console.log('Unauthorized request')
        return res.status(403).json({message: 'Unauthorized request'})
    }

}

module.exports = authorise