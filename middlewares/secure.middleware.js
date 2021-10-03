const createError = require('http-errors');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');

module.exports.auth = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(createError(401, 'user is not authenticated'))
  }
};

module.exports.self = function(req, res, next) {
  if (req.params.id == req.user.id) {
    next();
  } else {
    next(createError(403, 'forbidden'))
  }
};

module.exports.commentOwner = function(req, res, next) {
  Comment.findOne({
    _id: req.params.commentId,
    post: req.params.id
  })
    .then(comment => {
      if (comment) {
        req.comment = comment
        next()
      } else {
        next(createError(404, 'comment not found'))
      }
    })
    .catch(next)
}

module.exports.postOwner = function(req, res, next) {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        req.post = post
        next()
      } else {
        next(createError(404, 'post not found'))
      }
    })
    .catch(next)
}
