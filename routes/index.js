const router = require('express').Router();
// import all of the api routes from /api/index.js * NO NEED TO INCLUDE index.js IN THE ROUTE, IT IS ALREADY IMPLIED
const apiRoutes = require('./api');
const htmlRoutes = require('./html/html-routes');

// add '/api' prefix to all api routes
router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

router.use((req, res) => {
  res.status(404).send('<h1>😝 404 Error!</h1>');
});

module.exports = router;
