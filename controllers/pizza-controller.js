const { Pizza } = require('../models');

const pizzaController = {
    // functions will go in here as methods
    // GET all pizzas
    getAllPizza(req, res) {
        // mongoose .find() method, very much like sequelize's .findAll()
        Pizza.find({})
        .populate({
            path: 'comments',
            // removes from comment data returned
            select: '-__v'
        })
        // removes from pizza data returned
        .select('-__v')
        // sort in descending order by _id, always giving newest pizza first
        .sort({ _id: -1 })
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // get one pizza by id
    // instead of accessing req, we destructure params out of it
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
        .populate({
            path: 'comments',
            select: ('-__v')
        })
        .select('-__v')
        .then(dbPizzaData => {
            // if no pizza is found, send 404
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            } 
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    // createPizza
    createPizza({ body }, res) {
        // MongoDB methods for creating are .insertOne() or .insertmany(), but in Mongoose, we use .create() for both 
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    },

    // update pizza by id
    updatePizza({ params, body}, res) {
        // if we dont set { new: true }, mongoose will return the original document
        // add runValidatiors: true when you
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },
    // there are also mongoose and mongodb methods called .updateOne() and .updateMany(), which update documents without returning them

    // delete pizza
    deletePizza({ params }, res) {
        // we could have used .deleteOne() or .deleteMany(), bute .findOneAndDelete() provides more data, in case the client wants it
        Pizza.findOneAndDelete({ _id: params.id})
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;