const nodemailer = require('nodemailer');
const ejs = require('ejs')
const { convert } = require('html-to-text')

class Email {

  constructor(user, link, amount) {
    this.to = user.email
    this.name = user.firstName
    this.link = link
    this.amount = amount
  }

  async _createTransporter() {
    return nodemailer.createTransport({

      host: "smtp.zoho.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "info@spacexshare-ai.com",
        pass: "Sammy907$",
      }
    })
  }


  async _send(template, subject) {
    const html = await ejs.renderFile(`${__dirname}/../views/emails/${template}.ejs`, { link: this.link, name: this.name, amount: this.amount })

    const mailOptions = {
      from: 'Spacexshare-Ai <info@spacexshare-ai.com>', // sender address
      to: this.to,
      subject: subject,
      html,
      text: convert(html),
    }

    const transporter = await this._createTransporter()
    transporter.sendMail(mailOptions)
  }

  async sendWelcome() {
    await this._send("welcome", "Welcome to Spacexshare-Ai")
  }
  async sendDeposit() {
    await this._send("deposit", "New Deposit")
  }
  async sendDepositFinal() {
    await this._send("depositFinal", "Deposit Confirmed")
  }
  async sendDepositRejected() {
    await this._send("depositRejected", "Deposit Rejected")
  }
  async sendInvestment() {
    await this._send("investment", "New Investment")
  }
  async sendWithdrawal() {
    await this._send("withdrawal", "New Withdrawal")
  }
  async sendWithdrawalFinal() {
    await this._send("withdrawalFinal", "Withdrawal Confirmed")
  }
  async sendWithdrawalRejected() {
    await this._send("withdrawalRejected", "Withdrawal Rejected")
  }
  async sendForgotPassword() {
    await this._send("forgotPassword", "Forgot Password")
  }
  async sendBonus(){
    await this._send("bonus", "New Bonus")
  }
  async sendPenalty(){
    await this._send("penalty", "Penalty")
  }
  async sendKYC(){
    await this._send("kyc", "KYC")
  }
  async sendKYCFinal(){
    await this._send("kycConfirmed", "KYC Confirmed")
  }
  async sendPayout(){
    await this._send("payout", "Payout Received")
  }
}



module.exports = Email