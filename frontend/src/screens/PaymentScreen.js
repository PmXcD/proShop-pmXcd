import React, { useState } from 'react'
import { Button, Form, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = ({ history }) => {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    if(!shippingAddress){
        history.push('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }

  return <FormContainer>
      <CheckoutSteps step1 step2 step3/>
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
          <Form.Group>
              <Form.Label as='legend'>Select Payment Method</Form.Label>
              <Col>
                <Form.Check type='radio' label='Paypal or Credit Card' value='PayPal' id='PayPal' name='paymentMethod' checked onChange={(e)=>setPaymentMethod(e.target.value)}/>
              </Col>
              <Col>
                <Form.Check type='radio' label='Stripe' value='Stripe' id='Stripe' name='paymentMethod' onChange={(e)=>setPaymentMethod(e.target.value)}/>
              </Col>
          </Form.Group>
                <Button type='submit' variant='primary'>Continue</Button>
      </Form>
  </FormContainer>
}

export default PaymentScreen