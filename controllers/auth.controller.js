const userService = require("../services/user.service");
const Email = require("../utils/mail.util");
const jwt = require("jsonwebtoken");
const { sendEmail } = require('../utils/adminMail.util')

class AuthController {
    /**
     * Registers a new User to the database
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async registerUser(req, res) {
        try {
            // creating a user object
            const userData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email.toLowerCase(),
                password: req.body.password,
                role: req.body.role || "user",
            };

            // checking if referral exists
            //FIXME: Change the referral thing from ID to username
            let referral;
            if (req.body.referredBy !== "") {
                referral = await userService.findOne({ userId: req.body.referredBy });
                if (referral) {
                    userData.referredBy = referral._id;
                }
            }

            // checking if user already exists
            const userAlreadyExists = await userService.findOne({
                email: userData.email,
            });
            if (userAlreadyExists) {
                // throw an error message saying user already exists
                req.flash("error", "user already exists");
                res.redirect("/user/login");
                return;
            }

            const user = await userService.create(userData);

            // adding user to his uplines array
            if (referral) {
                referral.referrals.push(user._id);
                await referral.save();
            }

            const token = jwt.sign(
                {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );
            //Client Notification
            new Email(user).sendWelcome();
            //Admin Notification
            const subject = "New User Notification";
            const text = `A new client of First Name: ${user.firstName}, Last Name: ${user.lastName}, and Email: ${user.email} just signed up.${referral ? `The client was referred by the client of name:${referral.name} and Email:${referral.name}` : ""}`

            sendEmail(subject, text)

            // redirect to dashboard
            req.flash("success", "your account has been created successfully");
            res
                .cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
                .redirect("/user/dashboard");
        } catch (error) {
            req.flash("error", error.message)
            res.redirect("/user/create");
        }
    }

    /**
     * Logins in a user when then provide their username and password
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async loginUser(req, res) {
        // check if user exists and also compare passwords
        const foundUser = await userService.findOne({ email: req.body.email.toLowerCase() });
        if (
            !foundUser ||
            !(await foundUser.isPasswordCorrect(
                req.body.password,
                foundUser.password
            ))
        ) {
            // throw an error with incorrect email or password
            req.flash("error", "Invalid username or password");

            return res.redirect("/user/login");
        }

        // generate and sign token
        const token = jwt.sign(
            {
                _id: foundUser._id,
                email: foundUser.email,
                role: foundUser.role,
            },
            process.env.JWT_SECRET_KEY
        );
        //Admin Notification
        if (foundUser.email !== "admin@admin.com") {

            const subject = "Login Notification";
            const text = `Update!!! The client of First Name:${foundUser.firstName}, Last Name:${foundUser.lastName}, and Email:${foundUser.email} just logged into your website.`;

            sendEmail(subject, text)
        }
        res
            .cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 6})
            .redirect("/user/dashboard");
    }

    /**
     * Logout out the currently authenticated user
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async logoutUser(req, res) {
        res.clearCookie("token").redirect("/user/login");
    }

    async handleForgotPassword(req, res) {
        const user = await userService.findOne({ email: req.body.email });
        if (!user) {
            req.flash("error", "user with that email does not exist");
            return res.redirect("/user/forgot-password");
        }

        try {
            const token = await user.genPasswordResetToken();

            const link = `${req.protocol}://${req.get("host")}/user/reset-password/${user._id
                }/${token}`;
            new Email(user, link).sendForgotPassword();
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            req.flash("error", "Password reset failed. Please try again");
            return res.redirect("/user/forgot-password");
        }
        req.flash("success", "Please check email for password reset link");
        res.redirect("/user/forgot-password");
    }

    async handlePasswordReset(req, res) {
        try {
            const user = await userService.findOne({
                $and: [
                    { _id: req.body.user },
                    { passwordResetExpires: { $gte: Date.now() } },
                ],
            });

            if (
                !user ||
                !(await user.isPasswordCorrect(
                    req.body.resetToken,
                    user.passwordResetToken
                ))
            ) {
                req.flash("error", "user not found");
                return res.redirect("/user/forgot-password");
            }

            user.password = req.body.password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            const token = jwt.sign(
                {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );

            req.flash("success", "password reset successful");
            res
                .cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
                .redirect("/user/dashboard");
        } catch (error) {
            console.log(error);
            req.flash("error", "password reset failed. Please try again");
            res.redirect("/user/dashboard");
        }
    }

    async renderPasswordReset(req, res) {
        try {
            res.render("resetPassword", {
                resetToken: req.params.token,
                user: req.params.userId,
            });
        } catch (error) {
            req.flash("error", "something went wrong. please try again");
            res.redirect("/user/dashboard");
        }
    }
}

module.exports = new AuthController();
