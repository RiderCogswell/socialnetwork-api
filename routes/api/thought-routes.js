const router = require('express').Router();
const { 
    addThought,
    addReaction,
    removeThought,
    removeReaction
} = require('../../controllers/thought-controller');

// /api/comments/:<pizzaId>
router
    .route('/:userId')
    .post(addThought);

// /api/comments/:<pizzaId/:<commentId> *** WE NEED TWO PARAMS BECAUSE WE NEED TO KNOW WHICH PIZZA THAT COMMENT CAME FORM
router
    .route('/:userId/:thoughtId')
    .put(addReaction)
    .delete(removeThought);

// /api/thoughts/:userId/:thoughtId/:replyId
router
    .route('/:userId/:thoughtId/:reactionId')
    .delete(removeReaction);

module.exports = router;