const {
    getDashboardData
} = require('../Controller/Dashboard');
const express = require('express');
const router = express.Router();

router.get('/dashboard', getDashboardData);

module.exports = router;