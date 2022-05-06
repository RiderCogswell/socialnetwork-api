const { User } = require('../models');

const userController = {
    // functions will go in here as methods
    // GET all pizzas
    getAllUsers(req, res) {
        // mongoose .find() method, very much like sequelize's .findAll()
        User.find({})
        .populate({
            path: 'thoughts',
            // removes from comment data returned
            select: '-__v'
        })
        // removes from pizza data returned
        .select('-__v')
        // sort in descending order by _id, always giving newest pizza first
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // get one pizza by id
    // instead of accessing req, we destructure params out of it
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: ('-__v')
        })
        .select('-__v')
        .then(dbUserData => {
            // if no user is found, send 404
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            } 
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    // createPizza
    createUser({ body }, res) {
        // MongoDB methods for creating are .insertOne() or .insertmany(), but in Mongoose, we use .create() for both 
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // update pizza by id
    updateUser({ params, body}, res) {
        // if we dont set { new: true }, mongoose will return the original document
        // add runValidatiors: true when you
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    // there are also mongoose and mongodb methods called .updateOne() and .updateMany(), which update documents without returning them

    // delete pizza
    deleteUser({ params }, res) {
        // we could have used .deleteOne() or .deleteMany(), bute .findOneAndDelete() provides more data, in case the client wants it
        User.findOneAndDelete({ _id: params.id})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;