const Router = require('express');
const { signup } = require('../controller/authController');
const router = Router();

router.post('/signup', signup);

module.exports = router;