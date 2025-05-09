import express from 'express'
import users_controller from '../controllers/users_controller.js'
import { middleware_token_verify } from '../middlewares/token_verify.js'
var router = express.Router()

router.post('/register', users_controller.register)
router.post('/login', users_controller.login)
router.get('/graphs', middleware_token_verify, users_controller.grafos)

export default router
