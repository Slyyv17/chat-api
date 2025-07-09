const Router = require('express');
const protectUser = require('../middleware/protectUser');
const { uploadProfileImg, getUsers } = require('../controller/userController');
const { upload } = require('../middleware/upload');
const router = Router();

router.patch('/upload-photo', protectUser, upload.single('image'), uploadProfileImg);
router.get('/get-users', protectUser, getUsers);

module.exports = router;