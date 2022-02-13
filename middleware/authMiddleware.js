import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id)

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      .json('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    .json('Not authorized, no token')
  }
}

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    .json('Not authorized as an admin')
  }
}

export { protect, admin }
