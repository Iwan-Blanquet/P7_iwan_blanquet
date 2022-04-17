const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const commentCtrl = require('../controllers/comment');


router.post ('/:post_id/createcomment', commentCtrl.createComment);
router.get ('/:post_id/allcommentpost', commentCtrl.getAllComment);
//router.get ('/:id/lastcomment',auth, commentCtrl.getLastComment);
router.put ('/:id/deletecomment', commentCtrl.deleteOneComment);

module.exports = router;