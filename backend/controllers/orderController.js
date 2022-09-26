import asyncHandler from 'express-async-handler';
import Order from '../modals/orderModal.js';

//@desc    create order Items
//@route   POST /api/orders
//@access  Private
const addOrderItems = asyncHandler(async(req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body

    if(orderItems && orderItems.length === 0){
        res.status(400)
        throw new Error('No Order Items')
        return
    } else {
        const order = new Order({
            orderItems, user: req.user._id, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice
        })

        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
})

//@desc    Get order by ID
//@route   GET /api/orders/:id
//@access  Private
const getOrderById = asyncHandler(async(req, res) => {
   const order = await Order.findById(req.params.id).populate('user', 'name email')

   if(order){
       res.json(order)
   } else {
       res.status(404)
       throw new Error('Order not found')
   }
})

//@desc    update order pay status
//@route   GET /api/orders/:id/pay
//@access  Private
const updateOrderToPaid = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)
 
    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email: req.body.payer.email
        }

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
 })

//@desc    Get all orders by user
//@route   GET /api/orders/myorders
//@access  Private
const myOrdersList = asyncHandler(async(req, res) => {
    const orders = await Order.find({user: req.user.id})
 
    if (orders.length !== 0){
        res.json(orders)
    } else {
        res.status(404)
        throw new Error('No orders found')
    }
 })

 //@desc    Get all orders
//@route   GET /api/orders/
//@access  Private/admin
const getOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({}).populate('user','id name')
        res.json(orders)
 })

 //@desc   update order deliver status
//@route   post /api/orders/:id/delivered
//@access  Private/admin
const updateOrderToDelivered = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)
 
    if(order){
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
 })

export { addOrderItems, getOrderById, updateOrderToPaid, myOrdersList, getOrders, updateOrderToDelivered }
