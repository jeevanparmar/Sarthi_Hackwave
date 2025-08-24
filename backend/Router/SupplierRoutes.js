const SupplierController = require('../Controllers/SupplierController');
const express = require('express');
const router = express.Router();

router.post('/suppliers', SupplierController.createSupplier);