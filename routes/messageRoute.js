const Router = require('express');
const protectUser = require('../middleware/protectUser');
const { sendMessage, getMessages } = require('../controller/messageController');
const router = Router();

router.post('/send/:receiverId', protectUser, sendMessage);
router.get('/with/:receiverId', protectUser, getMessages);

module.exports = router;