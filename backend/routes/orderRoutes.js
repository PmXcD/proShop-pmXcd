import express from 'express';
import { addOrderItems, getOrderById, getOrders, myOrdersList, updateOrderToPaid } from '../controllers/orderController.js';
import {isAdmin, protect} from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, addOrderItems).get(protect, isAdmin, getOrders)
router.route('/myorders').get(protect, myOrdersList)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)

export default router