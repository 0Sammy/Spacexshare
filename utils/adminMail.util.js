const nodemailer = require('nodemailer');

function sendEmail(subject, text) {

    let transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
            user: "info@spacexshare-ai.com",
            pass: "Sammy907$",
        },
    });

    const mailOptions = {
        from: 'Spacexshare-Ai <info@spacexshare-ai.com>',
        to: "Leekoksang648@gmail.com",
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports = {  sendEmail };
