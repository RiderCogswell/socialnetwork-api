const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const validateEmail = function(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email)
}

// since we are using NoSQL, we don't have to define the fields, but for clarity and usability we should regulate what the data will look like
const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [validateEmail, 'Please enter a valid Email address!']
    },
    createdAt: {
        type: Date, 
        default: Date.now,
        // 'getter' to transform the data using the dateFormat func before it gets to the controller
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            // to Mongoose what 'references' is to Sequelize, tell model what documents to search to find in the comments
            ref: 'Thought'
        }
    ],
    // or we could specify the type as array
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]

},
{
    // when adding virtuals or getters we must ensure that we use them by adding a boolean value to the toJSON field
    toJSON: {
        virtuals: true,
        getters: true
    },
    // set id to false, because its an unneeded virtual and we dont want it
    id: false
}
);

// get total count of comments and replies on retrieval 
UserSchema.virtual('friendCount').get(function() {
    // reduce takes two params, an (accumalator, currentValue), revising the total as it gains more information (similar to .map() fuunction in the way that)
    return this.friends.reduce((total, friend) => total + friend.length + 1, 0)
})

// create the pizza model using the pizza schema
const User = model('User', UserSchema);

// export the Pizza model
module.exports = User;