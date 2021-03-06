import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../modals/userModal.js';

const protect = asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not Authorized, token failed')
        }
        next()
    }
    if(!token){
        res.status(401)
        throw new Error('Not Authorized, no token found')
    }
})

const isAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    } else {
        throw new Error('Not Authorized')
    }
}

export {protect, isAdmin}