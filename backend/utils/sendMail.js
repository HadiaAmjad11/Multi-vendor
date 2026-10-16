const nodemailer = require("nodemailer");

const getSmtpValue = (name) =>
  process.env[`SMTP_${name}`] || process.env[`SMPT_${name}`];

const sendMail = async (options) => {
  const host = getSmtpValue("HOST");
  const service = getSmtpValue("SERVICE");
  const port = Number(getSmtpValue("PORT")) || undefined;
  const user = getSmtpValue("MAIL");
  const password = getSmtpValue("PASSWORD");

  if ((!host && !service) || !user || !password) {
    throw new Error("SMTP configuration is incomplete");
  }

  const transporter = nodemailer.createTransport({
    ...(host && { host }),
    ...(service && { service }),
    ...(port && { port }),
    secure: port === 465,
    auth: {
      user,
      pass: password,
    },
  });
  const mailOptions = {
    from: user,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendMail;
