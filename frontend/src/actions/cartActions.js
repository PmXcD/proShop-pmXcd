import axios from 'axios';
import { CART_REMOVE_ITEM, CART_ADD_ITEM} from '../constants/cartConstants'

const addToCart = (id, qty) => async(dispatch, getState) => {
    const {data} = await axios.get(`/api/products/${id}`)
    dispatch({
        product: data._id,
        image: data.image,
        price: data.price,
        name: data.name,
        countInStock: data.countInStock,
        qty
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}