import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getOrderList } from '../actions/orderActions';
import { ORDER_LIST_RESET } from '../constants/orderConstants';

const OrderListScreen = ({history}) => {

    const dispatch = useDispatch()

    const orderList = useSelector(state => state.orderList)
    const { loading, orders, error} = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    
    useEffect(() => {
        if (userInfo && userInfo.isAdmin){
            dispatch(getOrderList())
        } else {
            dispatch({type: ORDER_LIST_RESET})
            history.push('/login')
        }
    },[dispatch, history, userInfo])

  return (
    <>
        <h1>Users</h1>
        { loading ? <Loader /> : error ? <Message variant={'danger'}>{error}</Message> : (
            <Table responsive bordered striped hover className='table-sm'>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>USER</td>
                        <td>DATE</td>
                        <td>TOTAL</td>
                        <td>PAID</td>
                        <td>DELIVERED</td>
                        <td>ACTIONS</td>
                    </tr>
                </thead>
                <tbody>
                    { orders && orders.map( order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.user && order.user.name}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>${order.totalPrice}</td>
                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : <i className='fas fa-times' style={{color:"red"}}></i>}</td>
                            <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <i className='fas fa-times' style={{color:"red"}}></i>}</td>
                            <td>
                                <LinkContainer to={`/order/${order._id}`}>
                                    <Button variant='light' className='btn-sm'>
                                        Details
                                    </Button>
                                </LinkContainer>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </>
  )
}

export default OrderListScreen