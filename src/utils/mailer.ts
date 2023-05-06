// imports
import { createTransport } from "nodemailer";

// variables
const EMAIL_USER: string = process.env.EMAIL_USER!;
const EMAIL_PASS: string = process.env.EMAIL_PASS!;

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

const getMailContent = (username: string, activationCode: string): string => {
    const mailContent = `
	<!DOCTYPE html>
	<html>
	
	  <head>
		<title>Peeko Account Activation</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
		  /* Email Styles */
		  body {
			font-family: Arial, sans-serif;
			font-size: 16px;
			line-height: 1.5;
			margin: 0;
			padding: 0;
			background-color: #f1f1f1;
			color: #333333;
		  }
	
		  .container {
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
			background-color: #ffffff;
			box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
			border-radius: 5px;
		  }
	
		  h1 {
			font-size: 28px;
			font-weight: bold;
			margin-top: 0;
			margin-bottom: 20px;
			text-align: center;
			color: rgb(176,0,255);
		  }
	
		  p {
			margin-top: 0;
			margin-bottom: 20px;
			font-size: 18px;
			line-height: 1.5;
			text-align: justify;
		  }
	
		  .footer {
			font-size: 14px;
			text-align: center;
			color: #999999;
		  }
	
		  .footer a {
			color: #007bff;
			text-decoration: none;
		  }
	
		</style>
	  </head>
	
	  <body>
		<div class="container">
		  <h1 class="gradient">Peeko Account Activation</h1>
		  <p>Hello ${username}</p>
		  <p>Thank you for registering on Peeko! Please use the following code to activate your account:</p>
		  <p style="text-align: center; font-size: 24px; font-weight: bold;">${activationCode}</p>
		  <p>If you did not request this activation code, please disregard this email.</p>
		  <p>Thank you,<br>The Peeko Team</p>
		  <div class="footer">
			<p>You are receiving this email because you registered on Peeko. If you did not register for Peeko, please ignore this email.</p>
			<p><a href="#">Peeko Website</a></p>
		  </div>
		</div>
	  </body>
	
	</html>	
	`;

    return mailContent;
};

export default (
    targetMail: string,
    username: string,
    activationCode: string
): Promise<string | Error> => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: EMAIL_USER,
            to: targetMail,
            subject: "Peeko Account Activation",
            html: getMailContent(username, activationCode),
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve(info.response);
            }
        });
    });
};
