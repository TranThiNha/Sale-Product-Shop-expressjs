const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
/*let transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'username@example.com',
        pass: 'userpass'
    }
});
*/
var transporter = nodemailer.createTransport('smtps://dtphuyen2506%40gmail.com:28051996@smtp.gmail.com');
// setup email data with unicode symbols
let mailOptions = {
    from: '"Huyen" <dtphuyen2506@gmail.com>', // sender address
    to: 'living.in.search.of.happiness@gmail.com', // list of receivers
    subject: 'okl', // Subject line
    text: 'Xin chào', // plain text bodyd
    html: 'http://localhost:3000/login.html' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});