/**
 * Mail sending handler
 */
import nodemailer from "nodemailer";

const options = {
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "gscolombo404@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
};

let transporter = nodemailer.createTransport(options);

exports.handler = async (event) => {
  const messageData = JSON.parse(event.body);

  let response = {
    statusCode: null,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: {},
  };

  const connectionSuccess = new Promise((resolve) => {
    transporter.verify((error) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });

  if (await connectionSuccess) {
    const message = {
      from: messageData.email,
      to: {
        name: "Gabriel Colombo",
        address: "gscolombo404@gmail.com",
      },
      replyTo: {
        name: messageData.name,
        address: messageData.email,
      },
      subject: "Contato - Website pessoal",
      text: messageData.message,
      priority: "high",
      headers: {
        "Reply-To": messageData.email,
      },
    };

    const info = await transporter.sendMail(message);
    if (info.response.includes("OK")) {
      response.body.message = "Mensagem enviada com sucesso!";
      response.body.info = info;
      response.statusCode = 200;
    } else {
      response.body.error = info;
      response.statusCode = 500;
    }
  } else {
    response.statusCode = 500;
    response.body.error = "Não foi possível conectar ao servidor SMTP.";
  }

  response.body = JSON.stringify(response.body);
  return response;
};
