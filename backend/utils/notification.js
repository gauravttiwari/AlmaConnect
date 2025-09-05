// Notification utility (email/push placeholder)
module.exports = {
  sendEmail: (to, subject, text) => {
    // Integrate nodemailer or other email service here
    console.log(`Email sent to ${to}: ${subject} - ${text}`);
  },
  sendPush: (userId, message) => {
    // Integrate Firebase or other push service here
    console.log(`Push sent to ${userId}: ${message}`);
  }
};
