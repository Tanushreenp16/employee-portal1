const sendMail = require("./utils/mailer");

sendMail("test@example.com", "Mailtrap Working", "<b>Hello!</b>")
  .then(() => console.log("✓ Email sent to Mailtrap"))
  .catch((err) => console.error("Error:", err));
