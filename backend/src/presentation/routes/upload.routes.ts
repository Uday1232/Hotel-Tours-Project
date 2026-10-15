import { Router, Request, Response } from 'express'
import { upload } from '../../infrastructure/services/upload'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/authorize'

const router = Router()

router.post('/',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file provided' })
      return
    }

    const folder = req.file.fieldname === 'tourImage' ? 'tours' : 'rooms'
    const url = `/uploads/${folder}/${req.file.filename}`

    res.status(200).json({
      success: true,
      data: {
        url,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      }
    })
  }
)

router.post('/multiple',
  authenticate,
  authorize('ADMIN'),
  upload.array('images', 10),
  (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[]
    if (!files?.length) {
      res.status(400).json({ success: false, message: 'No image files provided' })
      return
    }

    const folder = req.body.folder === 'tours' ? 'tours' : 'rooms'
    const urls = files.map(f => ({
      url: `/uploads/${folder}/${f.filename}`,
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
    }))

    res.status(200).json({ success: true, data: urls })
  }
)

export default router