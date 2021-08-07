/* eslint-disable linebreak-style */
const { Router } = require('express');
const apiRoutes = require('./api');

const router = Router();

router.get('/', (req, res) => res.send('API is running'));

router.use('/api', apiRoutes);

module.exports = router;
