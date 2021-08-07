/* eslint-disable linebreak-style */
const { Router } = require('express');
const isAdmin = require('../../middlewares/is-admin');

const router = Router();

router.use('/v1', require('./v1/public-routes'));
router.use('/v1/admin', [isAdmin], require('./v1/admin-routes'));

module.exports = router;
