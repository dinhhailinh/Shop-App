import Product from '../models/productModel.js'

const getProducts = async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword ?
    {
      name: {
        $regex: req.query.keyword,
        $options: 'i',
      },
    } :
    {}
  try {
    const count = await Product.countDocuments({
      ...keyword
    })
    const products = await Product.find({
        ...keyword
      })
      .limit(pageSize)
      .skip(pageSize * (page - 1))

    res.status().json({
      products,
      page,
      pages: Math.ceil(count / pageSize)
    })
  } catch (error) {
    res.status(500).json(error)
  }

}

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      res.status().json(product)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  } catch (error) {
    res.status(500).json(error)
  }

}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      await product.remove()
      res.status().json({
        message: 'Product removed'
      })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  } catch (error) {
    res.status(500).json(error)
  }

}

const createProduct = async (req, res) => {

  try {

    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      image: 'choose image',
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description',
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    res.status(500).json(error)
  }


}

const updateProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      product.name = name
      product.price = price
      product.description = description
      product.image = image
      product.brand = brand
      product.category = category
      product.countInStock = countInStock

      const updatedProduct = await product.save()
      res.status().json(updatedProduct)
    } else {
      res.status(404)
        .json('Product not found')
    }
  } catch (error) {
    res.status(500)
      .json(error)
  }

}

const createProductReview = async (req, res) => {
  const {
    rating,
    comment
  } = req.body
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      )

      if (alreadyReviewed) {
        res.status(400)
        throw new Error('Product already reviewed')
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      }

      product.reviews.push(review)

      product.numReviews = product.reviews.length

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length

      await product.save()
      res.status(201).json({
        message: 'Review added'
      })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  } catch (error) {
    res.status(500)
      .json(error)
  }

}

const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({
      rating: -1
    }).limit(3)

    res.status().json(products)
  } catch (error) {
    res.status(500)
      .json(error)
  }

}

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}