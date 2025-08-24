const { createSupplier ,
    getAllSuppliers,
    predictSupplyRisk   ,
    updateSupplier,
    createBodyUnit,
    updateBodyUnit,
    getAllBodyUnits,
    predictBodyUnitRisk
    
} = require('../Controller/Suppliers');

const express = require('express');
const router = express.Router();

router.post('/suppliers', createSupplier);
router.get('/suppliers', getAllSuppliers);
router.post("/predict", predictSupplyRisk);
router.post("/updateSupplier",updateSupplier)

router.post("/bodyUnit",createBodyUnit)
router.get("/bodyUnit",getAllBodyUnits)
router.post("/updateBodyUnit",updateBodyUnit)
router.post("/predictBodyUnit",predictBodyUnitRisk)


module.exports = router;