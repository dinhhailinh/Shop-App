import express from 'express'

import { upload } from '../middleware/uploadMidddleware.js'

const router = express.Router()

router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router
