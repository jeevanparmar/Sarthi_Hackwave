const { createSupplier ,
    getAllSuppliers,
    predictSupplyRisk   ,
    updateSupplier
} = require('../Controller/Suppliers');

const express = require('express');
const router = express.Router();

router.post('/suppliers', createSupplier);
router.get('/suppliers', getAllSuppliers);
router.post("/predict", predictSupplyRisk);
router.post("/updateSupplier",updateSupplier)

module.exports = router;