const { Thought, User } = require('../models');

const thoughtController = {
    // add comment to pizza
    addThought({params, body}, res) {
        console.log(body);
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                // where
                { _id: params.userId },
                // simply pushes comments._id into the pizza array
                // $ starting functions are built in mongo functs
                // what
                {  $push: { thoughts: _id }},
                // how
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    addReply({ params, body }, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            { $push: { replies: body } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => res.json(err));
    },

    // remove comment
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId }) 
        .then(deletedThought => {
            if (!deletedThought) {
                return res.status(404).json({ message: 'No thought with this id!' })
            }
            return User.findOneAndUpdate(
                { _id: params.userId },
                // delete commetId from pizza data
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return
            }
            // return pizza data to the user
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    removeReply({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;