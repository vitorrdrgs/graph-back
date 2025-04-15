import express from 'express';
import users_controller from '../controllers/users_controller.js';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', users_controller.register);
router.post('/login', users_controller.login);

export default router;
