const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const postCtrl = require('../controllers/post');

router.post('/createpost', multer, postCtrl.createPost);

router.get('/:id/onepost', postCtrl.getOnePost);

router.put('/:id/modifypost', multer, postCtrl.modifyPost);

router.delete('/:id/deletepost', postCtrl.deletePost);

router.post('/:post_id/like', postCtrl.likePost);

router.get('/', postCtrl.getAllPost);

router.get('/userposts', postCtrl.getAllUserPost);

module.exports = router;