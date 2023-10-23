import nodemailer from 'nodemailer'
import logger from '../logger.js';

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false,
    auth: {
        user: 'noreply@bloonsoo.com',
        pass: '746)PjJfA%2nEns'
    }
})

//KS.W+EZ6.LCje_d
//Bloonsoo.com@@#&

const sendEmail = async (subject, to, html) => {
    
    try {
        let info = await transporter.sendMail({
            from: 'noreply@bloonsoo.com',
            to: 'manjitharock@gmail.com', // list of receivers
            subject: subject, // Subject line
            // text: "Hello world?", // plain text body
            html: html, // html body
        })
    
        logger.info("Message sent: %s", info);
        console.log(info)
        return info
    }
    catch (error) {
        console.log(error)
        logger.error(error)
    }
    
}

export default sendEmail