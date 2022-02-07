const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');
const authicate= require("../controllers/authentication")
const router = express.Router();
router.get('/login', authicate.login);
router.post('/login', authicate.postLogin);
router.post('/signup', authicate.signup);
router.get('/bill',authicate.tokenAuth, adminController.getBill);


router.post('/add-bill',authicate.tokenAuth, adminController.postAddBill);

router.get('/daily',authicate.tokenAuth, adminController.getBillDaily);
router.post('/daily',authicate.tokenAuth, adminController.postDailyBill);

router.get('/monthly',authicate.tokenAuth, adminController.getBillMonthly);
router.get('/download/:id',authicate.tokenAuth, adminController.getBillDownload);

module.exports = router;
