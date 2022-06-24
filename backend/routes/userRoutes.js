import express from 'express';
import { authUser, deleteUser, getUserById, getUserprofile, getUsers, registerUser, updateUser, updateUserprofile } from '../controllers/userController.js'
import {isAdmin, protect} from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(registerUser).get(protect, isAdmin, getUsers)
router.post('/login',authUser)
router.route('/profile').get(protect, getUserprofile).put(protect, updateUserprofile)
router.route('/:id').delete(protect, isAdmin, deleteUser).get(protect, isAdmin, getUserById).put(protect, isAdmin, updateUser)


export default router