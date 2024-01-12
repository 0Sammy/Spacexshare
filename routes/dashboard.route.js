const express = require('express');
const router = express.Router();
const { renderDashboard } = require('../controllers/user.controller')
const fetchUserData = require('../middlewares/fetchUserData.middleware')

router.route('/')
    .get(fetchUserData, renderDashboard)


module.exports = router;