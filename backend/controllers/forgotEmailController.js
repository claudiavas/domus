const SibApiV3Sdk = require('sib-api-v3-sdk');
const jwt = require('jsonwebtoken');

/** Builds a signed, short-lived password recovery link. */
const recoveryLink = async (email, userId) => {
  try {
    const token = jwt.sign({ email, userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const link = `${process.env.FRONTEND_URL}/passwordrecovery?token=${token}`; // Password reset link carrying the token as a query parameter
    return link;
  } catch (error) {
    console.error('Error al generar el enlace de recuperación de contraseña:', error);
  }
};

/** Sends the password recovery email through Brevo. */
const sendEmail = async (req, res) => {
  try {
    const recipientEmail = req.body.email;
    const recipientName = req.body.name;
    const recipientId = req.body.userId;
    const link = await recoveryLink(recipientEmail, recipientId)

    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_APIKEY;

    await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
      // Sender must be a verified identity in the Brevo account
      "sender": { "email": process.env.EMAIL_FROM, "name": "Domus" },
      "subject": "This is my default subject line",
      "templateId": 1,
      "params": {
        "email": recipientEmail,
        "name": recipientName,
        "url": link
      },
      "messageVersions": [
        {
          "to": [
            {
              "email": recipientEmail,
              "nombre": recipientName,
              "url": link
            }
          ],
          "params": {
            "email": recipientEmail,
            "nombre": recipientName,
            "url": link
          },
          "subject": "Tu nueva contraseña de Domus"
        }
      ]
    });

    res.status(200).json({ message: 'Correo electrónico enviado' });

  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico' });
  }
};

module.exports = {
 sendEmail
};