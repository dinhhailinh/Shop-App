import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'


const authUser = async (req, res) => {
  const {
    email,
    password
  } = req.body
  try {
    const user = await User.findOne({
      email
    })

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
        .json('Invalid email or password')
    }
  } catch (error) {
    console.log(error);
    res.status(500)
      .json(error)
  }

}

const registerUser = async (req, res) => {
  const {
    name,
    email,
    password
  } = req.body
  try {
    const userExists = await User.findOne({
      email
    })

    if (userExists) {
      res.status(400)
        .json('User already exists')
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
        .json('Invalid user data')
    }
  } catch (error) {
    res.status(500)
      .json(error)
  }

}

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      })
    } else {
      res.status(404)
        .json('User not found')
    }
  } catch (error) {
    console.log(error);
    res.status(500)
      .json(error)
  }

}

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
        user.password = req.body.password
      }

      const updatedUser = await user.save()

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      })
    } else {
      res.status(404)
        .json('User not found')
    }
  } catch (error) {
    res.status(500)
      .json(error)
  }

}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json(users)
  } catch (error) {
    console.log(error);
    res.status(500)
      .json(error)
  }

}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      await user.remove()
      res.status(200).json({
        message: 'User removed'
      })
    } else {
      res.status(404)
        .json('User not found')
    }
  } catch (error) {
    res.status(500)
      .json(error)
  }

}

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')

    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404)
        .json('User not found')
    }
  } catch (error) {
    res.status(500)
      .json(error)
  }

}

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = req.body.isAdmin

      const updatedUser = await user.save()

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      })
    } else {
      res.status(404)
        .json('User not found')
    }
  } catch (error) {
    res.status(500)
      .json(error)
  }

}

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}