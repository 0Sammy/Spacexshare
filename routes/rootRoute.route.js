const express = require("express");
const router = express.Router();

const userRoute = require('./user.route')

//Importing routes

const aboutRoute = require("./about.route");
const contactRoute = require("./contact.route");
const faqRoute = require("./faq.route");
const indexRoute = require("./index.route");
const helpRoute = require("./help.route");
const newsRoute = require("./news.route");
const composeRoute = require("./compose.route");
const viewPost = require("./viewPost.route")
const legalRoute = require("./legal.route");


// Configuring routes

router.use("/", indexRoute);
router.use("/aboutUs", aboutRoute);
router.use("/contact", contactRoute);
router.use("/faq", faqRoute);
router.use("/index", indexRoute);
router.use('/support', helpRoute);
router.use("/news", newsRoute);
router.use("/compose", composeRoute);
router.use("/user", userRoute);
router.use("/posts", viewPost);
router.use("/legal", legalRoute)


// exporting router middleware
module.exports = router;
