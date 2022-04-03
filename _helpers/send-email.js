const nodemailer = require('nodemailer');

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM }) {
    const smtpOptions = {
        "host": process.env.SMTP_OPTIONS_HOST,
        "port": process.env.SMTP_OPTIONS_PORT,
        "auth": {
            "user": process.env.SMTP_OPTIONS_USER,
            "pass": process.env.SMTP_OPTIONS_PASSWORD
        }
    }
    const transporter = nodemailer.createTransport(smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}