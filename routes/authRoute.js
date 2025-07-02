const Router = require('express');
const { signupUser, loginUser } = require('../controller/authController');
const router = Router();

router.post('/user/signup', signupUser);
router.post('/user/login', loginUser);

module.exports = router;