import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/authorize'
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  updateUserRole
} from '../controllers/admin-user.controller'

const router = Router()

router.use(authenticate)
router.use(authorize('ADMIN'))

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.patch('/:id/toggle-status', toggleUserStatus)
router.patch('/:id/role', updateUserRole)

export default router