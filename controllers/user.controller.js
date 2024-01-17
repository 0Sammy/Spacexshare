require("dotenv").config();
const scheduler = require("node-schedule");
const { sendEmail } = require('../utils/adminMail.util')

const {
    starterDuration,
    regularDuration,
    proDuration,
    eliteDuration,
    starterPercent,
    regularPercent,
    proPercent,
    elitePercent,
} = require("../config");

const userService = require("../services/user.service");
const transactionService = require("../services/transaction.service");
const User = require("../models/user.model");
const Email = require("../utils/mail.util");
const splitTransactions = require("../utils/splitTransactions.util");
const getWallet = require("../utils/getWallet.util");

class UserController {
    async renderDashboard(req, res) {
        const userInformation = req.userData;
        if (userInformation.role === "admin") {
            req.flash("success", "welcome back");
            return res.redirect("/user/admin");
        }
        
        const { deposits, earnings, investments, withdrawals } = splitTransactions(
            userInformation.transactions
        );

        const lastThreeTransactions = userInformation.transactions.slice(-3);
        return res.render("dashboard", {
            user: userInformation,
            deposits,
            withdrawals,
            investments,
            earnings,
            lastThreeTransactions,
        });
    }

    async renderProfile(req, res) {
        const userInformation = req.userData;
        res.render("profile", { user: userInformation });
    }

    async editUserProfile(req, res) {
        try {
            const updateData = Object.fromEntries(
                Object.entries(req.body).filter(([key, value]) => value !== "")
              );
            delete updateData.password;

            const user = await userService.update({ _id: req.user._id }, updateData, {
                new: true,
                runValidators: true,
            });

            if (req.body.password && req.body.password.length > 3) {
                user.password = req.body.password;
                await user.save();
            }

            req.flash("success", "Your Profile Was Updated Successfully");
            res.redirect("/user/profile");
        } catch (error) {
            req.flash("fail", "Failed To Update  Your Profile. Please Try Again");
            res.redirect("/user/profile");
        }
    }

    async renderReferral(req, res) {
        const userInformation = req.userData;
        res.render("referral", { user: userInformation });
    }

    async renderTransaction(req, res) {
        const { transactions } = req.userData;

        transactions.sort((a, b) => b.createdAt - a.createdAt);
        // console.log({transactions})
        res.render("history", { transactions });
    }

    async renderRegisterPage(req, res) {
        const { role, ref: referral } = req.query;
        res.render("create", { referral, role });
    }

    async handleWithdrawal(req, res) {
        try {
            if (req.body.amount > req.userData.balance) {
                req.flash("error", "Insufficient funds");
                return res.redirect("/user/withdraw")
            }
            const transactionData = {
                user: req.user._id,
                type: "withdrawal",
                amount: req.body.amount,
                account: {
                    walletType: req.body.wallet,
                    address: req.body.address,
                },
            };

            await transactionService.create(transactionData);

            req.flash("success", "Your Withdrawal Request Was Placed Successfully.");

            const user = await User.findById(req.user._id);
            //Client Notification
            new Email(user, ".", transactionData.amount).sendWithdrawal();

            //Admin Notification
            const subject = "New Withdrawal Notification"
            const text = `The client of name: ${user.firstName} ${user.lastName} and email ${user.email} just withdrew amount: $${transactionData.amount} from his account now, kindly log in to confirm the withdrawal.`

            sendEmail(subject, text)
           
            res.redirect("/user/withdraw");
        } catch (error) {
            req.flash("error", "Something Went Wrong, Please Try Again Later.");
            res.redirect("/user/withdraw");
        }
    }

    async handleDeposit(req, res) {
        try {
            if (req.body.medium === "bank") {
                res.render("checkout", {
                    amount: req.body.amount,
                    medium: req.body.medium,
                    wallet: "",
                });
            } else if (req.body.medium == "crypto") {
                res.render("checkout", {
                    amount: req.body.amount,
                    medium: req.body.medium,
                    wallet: getWallet(req.body.coin),
                });
            }
        } catch (error) {
            req.flash("error", "Sorry, you can't deposit now, try again Later.");
            res.redirect("/user/deposit");
        }
    }

    async handleCheckout(req, res) {
        try {
            if (req.body.action === "cancel") {
                return res.redirect("/user/deposit");
            }

            const transactionData = {
                user: req.user._id,
                type: "deposit",
                amount: req.body.amount,
                medium: req.body.medium,
                transactionID: req.body.transactionID,
            };

            await transactionService.create(transactionData);

            req.flash("success", "Your Deposit Was Placed Successfully");
            const user = await User.findById(req.user._id);

            //Client Notification
            new Email(user, ".", transactionData.amount).sendDeposit();
            
            //Admin Notification
            const subject = "New Deposit Notification"
            const text = `The client ${user.firstName} ${user.lastName} and email ${user.email} just deposited $${transactionData.amount} in your website, Spacexshare-ai, kindly log in to confirm.`
            
            sendEmail(subject, text)
        
            res.redirect("/user/deposit");
        } catch (error) {
            req.flash("fail", "deposit failed");
            res.redirect("/user/deposit");
        }
    }

    async renderInvestment(req, res) {
        try {
            const userData = await User.findById(req.user._id).populate(
                "transactions"
            );

            const { investments } = splitTransactions(userData.transactions);

            const activeInvestments = investments.filter(
                (investment) => Date.now() < investment.expiresAt
            );

            res.render("invest", { investments: activeInvestments });
        } catch (error) {
            req.flash("error", error.message);
        }
    }

    async handleInvestment(req, res) {
        try {
            if (req.body.amount > req.userData.balance) {
                req.flash("info", "insufficient funds. please deposit to continue");
                return res.redirect("/user/deposit");
            }

            let payoutDuration;

            switch (req.body.plan) {
                case "starter":
                    payoutDuration = starterDuration;
                    break;
                case "regular":
                    payoutDuration = regularDuration;
                    break;
                case "pro":
                    payoutDuration = proDuration;
                    break;
                case "elite":
                    payoutDuration = eliteDuration;
                    break;
            }

            const transactionData = {
                user: req.user._id,
                type: "investment",
                amount: req.body.amount,
                status: "successful",
                plan: req.body.plan,
                active: true,
                expiresAt: Date.now() + payoutDuration,
            };

            const investment = await transactionService.create(transactionData);

            const payoutDate = new Date(investment.expiresAt);

            // Schedule user's  investment
            const job = scheduler.scheduleJob(payoutDate, async function () {
                const transaction = await transactionService.update(
                    { _id: investment._id },
                    { active: false, isFulfilled: true }
                );

                let amount;

                switch (transaction.plan) {
                    case "starter":
                        amount = (
                            transaction.amount +
                            starterPercent * transaction.amount * 1
                        ).toFixed(2);
                        break;
                    case "regular":
                        amount = (
                            transaction.amount +
                            regularPercent * transaction.amount * 2
                        ).toFixed(2);
                        break;
                    case "pro":
                        amount = (
                            transaction.amount +
                            proPercent * transaction.amount * 6
                        ).toFixed(2);
                        break;
                    case "elite":
                        amount = (
                            transaction.amount +
                            elitePercent * transaction.amount * 30
                        ).toFixed(2);
                        break;
                    default:
                        amount = 0;
                        break;
                }

                const earningData = {
                    user: transaction.user._id,
                    type: "earning",
                    amount,
                    status: "successful",
                    plan: transaction.plan,
                };

                await transactionService.create(earningData);
                const user = await userService.findOne({ _id: earningData.user._id });
                //Client Notification
                new Email(user, ".", earningData.amount).sendPayout();

            });

            req.flash("success", "Your Investment Was Initiated Successfully")
            const user = await User.findById(req.user._id);

            //Client Notification
            new Email(user, "", transactionData.amount).sendInvestment();

            //Admin Notification
            const subject = "New Investment Notification";
            const text = `The client of name: ${user.firstName} ${user.lastName} and email: ${user.email} just started the ${transactionData.plan}  plan with the amount $${transactionData.amount} in your website.`;

            sendEmail(subject, text)
            
            res.redirect("/user/invest");
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/user/invest");
        }
    }
}
module.exports = new UserController();
