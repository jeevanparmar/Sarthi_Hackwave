const {
    getDashboardData,
    getReports,
} = require('../Controller/Dashboard');
const express = require('express');
const router = express.Router();

router.get('/dashboard', getDashboardData);
router.get('/getReports',getReports)

module.exports = router;