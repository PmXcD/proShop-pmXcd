import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useSelector, useDispatch } from 'react-redux'
import { listProductDetails, updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import axios from 'axios'

const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id
    const [name,setName] = useState('')
    const [price,setPrice] = useState(0)
    const [brand,setBrand] = useState('')
    const [countInStock,setCountInStock] = useState(0)
    const [description,setDescription] = useState('')
    const [category,setCategory] = useState('')
    const [image,setImage] = useState('')
    const [uploading,setUploading] = useState(false)

    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails)
    const {loading, error, product} = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const {loading: loadingUpdate, error: errorUpdate, success: successUpdate} = productUpdate

    useEffect (()=>{
        if( successUpdate ){
            dispatch({type: PRODUCT_UPDATE_RESET})
            history.push('/admin/productList')
        } else {
            if(!product.name || product._id !== productId){
                dispatch(listProductDetails(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setDescription(product.description)
                setCountInStock(product.countInStock)
                setCategory(product.category)
                setBrand(product.brand)
            }
        }
    },[ dispatch, history, successUpdate, product, productId ])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({_id: productId, name, price, description, countInStock, category, brand, image}))
    }

    const uploadHandler = async (e) => {
        const file = e.target.files[0]
        const formdata = new FormData()
        formdata.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers : {
                    'content-type': 'multipart/form-data'
                }
            }

            const data = await axios.post('/api/upload', formdata, config)

            console.log("imageupladdata:: ", data)

            setImage(data.data)
            setUploading(false)
        } catch(error) {
            console.log(error)
            setUploading(false)
        }
    }

    return (
        <>
            <Link to='/admin/productList' className='btn btn-light my-3'>Go Back</Link>
            <FormContainer>
            <h1>Edit Product</h1>
            { loadingUpdate && <Loader /> }
            { errorUpdate && <Message variant={'danger'}>{errorUpdate}</Message>}
            {
                loading ? <Loader /> : error ? <Message variant={'danger'}>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' placeholder='Enter name' value={name} onChange={(e)=> setName(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId='price'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type='number' placeholder='Enter Price' value={price} onChange={(e)=> setPrice(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId='image'>
                    <Form.Label>Image</Form.Label>
                    <Form.Control type='text' placeholder='Enter Image URL' value={image} onChange={(e)=> setImage(e.target.value)}></Form.Control>
                    <Form.File custom id="image-file" label='Choose file' onChange={uploadHandler}></Form.File>
                    { uploading && <Loader /> }
                </Form.Group>

                <Form.Group controlId='brand'>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control type='text' placeholder='Enter Brand' value={brand} onChange={(e)=> setBrand(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId='category'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control type='text' placeholder='Enter Category' value={category} onChange={(e)=> setCategory(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId='countInStock'>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type='number' placeholder='Enter Quantity' value={countInStock} onChange={(e)=> setCountInStock(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId='description'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control type='text' placeholder='Enter Description' value={description} onChange={(e)=> setDescription(e.target.value)}></Form.Control>
                </Form.Group>

                <Button variant='primary' type='submit'>Update</Button>
            </Form>
                )
            }
            
        </FormContainer>
        </>
    )
}

export default ProductEditScreen
