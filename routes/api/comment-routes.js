const router = require('express').Router();
const { 
    addComment,
    addReply,
    removeComment,
    removeReply
} = require('../../controllers/comment-controller');

// /api/comments/:<pizzaId>
router
    .route('/:pizzaId')
    .post(addComment);

// /api/comments/:<pizzaId/:<commentId> *** WE NEED TWO PARAMS BECAUSE WE NEED TO KNOW WHICH PIZZA THAT COMMENT CAME FORM
router
    .route('/:pizzaId/:commentId')
    .put(addReply)
    .delete(removeComment);

// /api/comments/:pizzaId/:commentId/:replyId
router
    .route('/:pizzaId/:commentId/:replyId')
    .delete(removeReply);

module.exports = router;