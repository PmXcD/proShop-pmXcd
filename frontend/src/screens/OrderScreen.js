import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { ListGroup, Row, Col, Image, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getOrderDetails, updateOrderDeliver, updateOrderPay } from '../actions/orderActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {

    const orderId = match.params.id
    const dispatch = useDispatch()

    const [ sdkReady, setSdkReady ] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    useEffect(()=> {

        if(!userInfo) {
            history.push('/login')
        } else {
        const addPaypalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }

        if(!order || successPay || successDeliver){
            dispatch({type: ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVER_RESET})
            dispatch(getOrderDetails(orderId))
        } else if(!order.isPaid){
            if(!window.paypal){
                addPaypalScript()
            } else {
                setSdkReady(true)
            }
        }
    }
    },[dispatch, userInfo, history, successDeliver, orderId, order, successPay, match])    

    if(!loading){
    //add decimal
    const addDecimal = (num) => {
        return (Math.round(num * 100)/100).toFixed(2)
    }
    //calculate prices
    order.itemsPrice = addDecimal(order.orderItems.reduce((acc, item) => acc + (item.qty * item.price), 0))
    }

    const successHandler = (paymentResult) => {
        dispatch(updateOrderPay(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(updateOrderDeliver(order))
    }

  return (
    loading ? <Loader /> :( error ? <Message variant={'danger'}>{error}</Message> : <>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p><strong>Name:</strong> {order.user.name}</p>
                        <p><strong>Email:</strong> {order.user.email}</p>
                        <p>
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        
                            {order.isDelivered ? <Message variant={'success'}>Delivered on {order.deliveredAt.substring(0,10)}</Message> : <Message variant={'danger'}>Not Delivered</Message>}
                        
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        
                            {order.isPaid ? <Message variant={'success'}>Paid on {order.paidAt.substring(0,10)}</Message> : <Message variant={'danger'}>Not Paid</Message>}
                        
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? <Message>No Order Found</Message> : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded/>
                                            </Col>
                                            <Col>
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} X ${item.price} = ${item.qty * item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col><strong>Items</strong></Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col><strong>Shipping</strong></Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col><strong>Tax</strong></Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col><strong>Total</strong></Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        {
                            !order.isPaid && (
                                <ListGroup.Item>
                                    { loadingPay && <Loader /> }
                                    { !sdkReady ? <Loader /> : <PayPalButton amount={order.totalPrice} onSuccess={successHandler} />}
                                </ListGroup.Item>
                            )
                        }
                        {loadingDeliver && <Loader />}
                        {
                            userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type="button" className='btn btn-block' onClick={deliverHandler}>
                                        Mark As Delivered
                                    </Button>
                                </ListGroup.Item>
                            )
                        }
                    </ListGroup>
                </Card>
            </Col>
        </Row>

    </>)
  )
}

export default OrderScreen