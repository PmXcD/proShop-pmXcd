import React, { useEffect } from 'react'
import { Button, ListGroup, Row, Col, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createOrderAction } from '../actions/orderActions'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'

const PlaceorderScreen = ({ history }) => {

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)

    //add decimal
    const addDecimal = (num) => {
        return (Math.round(num * 100)/100).toFixed(2)
    }

    //calculate prices
    cart.itemsPrice = addDecimal(cart.cartItems.reduce((acc, item) => acc + (item.qty * item.price), 0))
    cart.shippingPrice = addDecimal(cart.itemsPrice > 100 ? 0 : 100)
    cart.taxPrice = addDecimal(Number((0.18 * cart.itemsPrice).toFixed(2)))
    cart.totalPrice = addDecimal(Number(cart.itemsPrice)+Number(cart.shippingPrice)+Number(cart.taxPrice))

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    useEffect(()=> {
        if(success){
            history.push(`/order/${order._id}`)
        }
        // eslint-disable-next-line
    },[success, history])

    const placeOrderHandler = () => {
        dispatch(createOrderAction({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        }))
    }

  return (
    <>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {cart.cartItems.length === 0 ? <Message>Your cart is empty</Message> : (
                            <ListGroup variant='flush'>
                                {cart.cartItems.map((item, index) => (
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
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col><strong>Shipping</strong></Col>
                                <Col>${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col><strong>Tax</strong></Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col><strong>Total</strong></Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        { error &&
                        <ListGroup.Item>
                             <Message variant='danger'>{error}</Message>
                        </ListGroup.Item>
                        }
                        <ListGroup.Item>
                            <Button type='button' className='btn-block' disabled={cart.cartItems.length === 0} onClick={placeOrderHandler}>Place Order</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default PlaceorderScreen