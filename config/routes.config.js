const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config')
const users = require('../controllers/users.controller')
const posts = require('../controllers/posts.controller')
const sec = require('../middlewares/secure.middleware')

router.post('/users', upload.single('avatar'), users.create)
router.get('/users/:id', sec.auth, users.get)
router.patch('/users/:id', sec.auth, sec.self, upload.single('avatar'), users.update)
router.delete('/users/:id', sec.auth, sec.self, users.delete)

router.post('/login', users.login)
router.post('/logout', sec.auth, users.logout)
router.get('/authenticate/google', users.loginWithGoogle)
router.get('/authenticate/google/cb', users.doLoginWithGoogle)

router.get('/posts', sec.auth, posts.list)
router.post('/posts', sec.auth, upload.single('image'), posts.create)
router.delete('/posts/:id', sec.auth, sec.postOwner, posts.delete)
router.post('/posts/:id/like', sec.auth, posts.like)
router.post('/posts/:id/comments', sec.auth, posts.createComment)
router.delete('/posts/:id/comments/:commentId', sec.auth, sec.commentOwner, posts.deleteComment)

module.exports = router;
