const router = require('express').Router();
const { 
    addThought,
    addReply,
    removeThought,
    removeReply
} = require('../../controllers/thought-controller');

// /api/comments/:<pizzaId>
router
    .route('/:userId')
    .post(addThought);

// /api/comments/:<pizzaId/:<commentId> *** WE NEED TWO PARAMS BECAUSE WE NEED TO KNOW WHICH PIZZA THAT COMMENT CAME FORM
router
    .route('/:userId/:thoughtId')
    .put(addReply)
    .delete(removeThought);

// /api/thoughts/:userId/:thoughtId/:replyId
router
    .route('/:userId/:thoughtId/:replyId')
    .delete(removeReply);

module.exports = router;