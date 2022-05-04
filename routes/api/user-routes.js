const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser, 
    deleteUser
} = require('../../controllers/user-controller');



// set up GET all and POST at /api/pizzas
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

// set up GET one, PUT, and DELETE at /api/pizza/:id
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;

// // this code
// router.route('/').get(getCallbackFunction).post(postCallbackFunction);

// // is this same as this
// router.get('/', getCallbackFunction);
// router.post('/', postCallbackFunction);