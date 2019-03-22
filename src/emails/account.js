const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'aristotlepoultney@gmail.com',
    subject: 'Thanks for signing up.',
    text: `Welcome to the app, ${name}`
  });
};

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'aristotlepoultney@gmail.com',
    subject: 'Sorry to see you go',
    text: `Sorry we couldn't keep you on board, ${name}. Could you give us feedback on what to improve?`
  });
};

module.exports = { sendWelcomeEmail, sendGoodbyeEmail };
