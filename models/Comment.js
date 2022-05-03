const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema (
    {
        replyId: {
            // uses the same style of ids, but give it the name replyId
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String,
            required: 'No input!',
            trim: true
        },
        writtenBy: {
            type: String,
            required: 'Please enter an author name!',
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },    
    },
    {
        toJSON: {
            getters: true
        }
    }
); 

const CommentSchema = new Schema (
    {
        writtenBy: {
            type: String,
            required: 'Please enter an author name!',
            trim: true
        },
        commentBody: {
            type: String,
            required: 'No input!',
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        // use reply schema to validate data for a reply
        replies: [ReplySchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

// set up a virtual that keeps track of comments replies
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
})

// create comment model using the comment schema 
const Comment = model('Comment', CommentSchema) 

module.exports = Comment;