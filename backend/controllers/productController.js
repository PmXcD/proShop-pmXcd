import asyncHandler from 'express-async-handler';
import Product from '../modals/productModal.js';

//@desc    Get all Products
//@route   GET /api/products
//@access  Public
const getProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({})
    res.json(products)
})

//@desc    Get product by ID
//@route   GET /api/products/:id
//@access  Public
const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if(product){
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found!')
    }
})

//@desc    Delete product
//@route   POST /api/product/:id
//@access  Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        product.remove()
        res.json({message: "Product Removed"})
    } else {
        res.status(404)
        throw new Error("Product not found")
    }
})

//@desc    Create sample product
//@route   POST /api/products
//@access  Private/admin
const createSampleProduct = asyncHandler(async(req, res) => {
    const product = new Product({
        name : 'Sample Name',
        price: 0,
        user: req.user.id,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: "Sample Category",
        countInStock: 0,
        numReviews: 0,
        description: "Sample description of product"
    })

    const createdProduct = await product.save()

    if (createdProduct) {
        res.status(201).json(product)
    } else {
        res.status(400)
        throw new Error('Invalid product data')
    }
})

//@desc    Update a product
//@route   POST /api/products/:id
//@access  Private/admin
const updateProduct = asyncHandler(async(req, res) => {
    const{
        name,
        price,
        user,
        image,
        brand,
        category,
        countInStock,
        numReviews,
        description
    } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.price = price
        product.user = req.user.id
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
        product.numReviews = numReviews ? numReviews : 0
        product.description = description

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

export { getProducts, getProductById, deleteProduct, createSampleProduct, updateProduct}