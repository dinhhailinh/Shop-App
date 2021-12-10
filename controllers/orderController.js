import Order from '../models/orderModel.js'

const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body
  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400)
        .json('No order items')
      return
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })

      const createdOrder = await order.save()

      res.status(201).json(createdOrder)
    }
  } catch (error) {
    res.status(500)
      .json(error)
  }

}

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    )

    if (order) {
      res.status(200).json(order)
    } else {
      res.status(404)
        .json('Order not found')
    }
  } catch (error) {
    res.status(500)
      .json(error)
  }

}

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      }

      const updatedOrder = await order.save()

      res.status(200).json(updatedOrder)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  } catch (error) {
    res.status(500)
      .json(error)
  }

}

const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()

      const updatedOrder = await order.save()

      res.status(200).json(updatedOrder)
    }
  } catch (error) {
    res.status(404)
      .json({
        'Order not found': error
      })
  }

}

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id
    })
    res.status.json(orders)
  } catch (error) {
    res.status(500).json(error)
  }

}

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name')
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json(error)
  }

}

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}