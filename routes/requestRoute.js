const Router = require('express');
const protectUser = require('../middleware/protectUser');
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, getIncomingFriendRequests, getSentFriendRequests } = require('../controller/requestController');
const router = Router();

router.post('/friends/request/:userId', protectUser, sendFriendRequest);
router.put('/friends/accept/:requestId', protectUser, acceptFriendRequest);
router.put('/friends/reject/:requestId', protectUser, rejectFriendRequest);
router.delete('/friends/cancel/:requestId', protectUser, cancelFriendRequest);
router.get('/friends/incoming', protectUser, getIncomingFriendRequests);
router.get('/friends/sent', protectUser, getSentFriendRequests);


module.exports = router;