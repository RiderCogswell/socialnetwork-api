const { Comment, Pizza } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({params, body}, res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                // where
                { _id: params.pizzaId },
                // simply pushes comments._id into the pizza array
                // $ starting functions are built in mongo functs
                // what
                {  $push: { comments: _id }},
                // how
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            { $push: { replies: body } },
            { new: true, runValidators: true }
        )
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza fpund with this id!' });
                return;
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.json(err));
    },

    // remove comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId }) 
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id!' })
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                // delete commetId from pizza data
                { $pull: { comments: params.commentId } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return
            }
            // return pizza data to the user
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    }
};

module.exports = commentController;