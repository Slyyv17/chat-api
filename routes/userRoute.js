const Router = require('express');
const protectUser = require('../middleware/protectUser');
const { uploadProfileImg } = require('../controller/userController');
const { upload } = require('../middleware/upload');
const router = Router();

router.patch('/upload-photo', protectUser, upload.single('image'), uploadProfileImg);

module.exports = router;