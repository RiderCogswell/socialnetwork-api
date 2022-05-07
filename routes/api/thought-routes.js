const router = require('express').Router();
const { 
    getThoughts,
    getThoughtById,
    addThought,
    addReaction,
    updateThought,
    removeThought,
    removeReaction
} = require('../../controllers/thought-controller');

router
    .route('/')
    .get(getThoughts);

router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(removeThought)

router
    .route('/:userId')
    .post(addThought);

// /api/comments/:<userId/:<thoughtId> *** WE NEED TWO PARAMS BECAUSE WE NEED TO KNOW WHICH user THAT COMMENT CAME FORM
router
    .route('/:thoughtId/reactions')
    .post(addReaction);

// /api/thoughts/:userId/:thoughtId/:replyId
router
    .route('/:thoughtId/:reactions/:reactionId')
    .delete(removeReaction);

module.exports = router;