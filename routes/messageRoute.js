const Router = require('express');
const protectUser = require('../middleware/protectUser');
const { sendMessage } = require('../controller/messageController');
const router = Router();

router.post('/send/:receiverId', protectUser, sendMessage);

module.exports = router;