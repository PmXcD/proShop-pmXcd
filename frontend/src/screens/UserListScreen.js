import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getUserList, deleteUser } from '../actions/userActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { USER_LIST_RESET } from '../constants/userConstants';

const UserListScreen = ({history}) => {

    const dispatch = useDispatch()

    const userList = useSelector(state => state.userList)
    const { loading, users, error} = userList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete
    
    useEffect(() => {
        if (userInfo && userInfo.isAdmin){
            dispatch(getUserList())
        } else {
            dispatch({type: USER_LIST_RESET})
            history.push('/login')
        }
    },[dispatch, history, userInfo, successDelete])

    const deleteHandler = (id) => {
        if(window.confirm("Are you sure?"))
        dispatch(deleteUser(id))
    }

  return (
    <>
        <h1>Users</h1>
        { loading ? <Loader /> : error ? <Message variant={'danger'}>{error}</Message> : (
            <Table responsive bordered striped hover className='table-sm'>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>NAME</td>
                        <td>EMAIL</td>
                        <td>ADMIN</td>
                        <td>ACTIONS</td>
                    </tr>
                </thead>
                <tbody>
                    { users && users.map( user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                            <td>{user.isAdmin ? <i className='fas fa-check' style={{color:"green"}}></i> : <i className='fas fa-times' style={{color:"red"}}></i>}</td>
                            <td>
                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                    <Button variant='light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>
                                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </>
  )
}

export default UserListScreen