const express = require('express');
const router = express.Router();
const { renderAdminDashboard } = require('../controllers/admin.controller')


const adminDepositRoute = require('./adminDeposit.route')
const adminWithdrawRoute = require('./adminWithdraw.route')
const adminReferralRoute = require('./adminRefer.route')
const adminUserRoute = require('./adminUser.route')
const adminProfileRoute = require('./adminPersonalProfile.route')
const adminBonusRoute = require('./addBonus.route')
const adminInvestmentsRoute = require('./adminInvestments.route')
const adminKYCRoute = require('./adminKYC.route')
const adminPenaltyRoute = require('./adminPenalty.route')

router.use('/deposit', adminDepositRoute)
router.use('/withdraw', adminWithdrawRoute)
router.use('/referral', adminReferralRoute)
router.use('/user', adminUserRoute)
router.use('/profile', adminProfileRoute)
router.use('/bonus', adminBonusRoute)
router.use('/investments', adminInvestmentsRoute)
router.use('/kyc', adminKYCRoute)
router.use('/penalty', adminPenaltyRoute)

router.get('/', renderAdminDashboard)

module.exports = router