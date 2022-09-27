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

//@desc    Create new review
//@route   POST /api/products/:id/reviews
//@access  Private
const createProductReview = asyncHandler(async(req, res) => {

    const {rating, comment} = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString()===req.user._id.toString())
        if(alreadyReviewed){
            res.status(400)
            throw new Error("Product already reviwed")
        } else {
            const review = {
                name : req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id
            }

            product.reviews.push(review)
            product.numReviews = product.reviews.length
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0)/product.reviews.length

            await product.save()
            res.status(201).json({message: "Review Added"})
        }
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

export { getProducts, getProductById, deleteProduct, createSampleProduct, updateProduct, createProductReview}