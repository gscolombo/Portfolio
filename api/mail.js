/**
 * Mail sending handler
 */
import nodemailer from "nodemailer";

const options = {
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
        user: 'gscolombo404@gmail.com',
        pass: process.env.GMAIL_PASSWORD,
    }
}

let transporter = nodemailer.createTransport(options);

exports.handler = async (event) => {
    const messageData = JSON.parse(event.body);

    let response = {
        statusCode: null,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    };
    
    const connectionSuccess = new Promise((resolve) => {
        transporter.verify((error) => {
            if (error) {
                resolve(false)
            } else {
                resolve(true);
            }
        })
    })
        
    if (await connectionSuccess) {
        const message = {
            from: messageData.email,
            to: {
                name: "Gabriel Colombo",
                address: 'gscolombo404@gmail.com'
            },
            replyTo: {
                name: messageData.name,
                address: messageData.email
            },
            subject: "Contato - Website pessoal",
            text: messageData.message,
            priority: 'high',
            headers: {
                'Reply-To': messageData.email
            }

        }
        
        const res = await transporter.sendMail(message);
        if (res.response.includes("OK")) {
            response.statusCode = 200;
        } else {
            response.statusCode = 500;
        }
    } else {
        response.statusCode = 500;
        response.error = "Não foi possível conectar ao servidor SMTP."
    }
    
    return response;
}