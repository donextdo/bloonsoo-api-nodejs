import nodemailer from 'nodemailer'



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
            to: to, // list of receivers
            subject: subject, // Subject line
            // text: "Hello world?", // plain text body
            html: html, // html body
        })
    
        return info
    }
    catch (error) {
        console.log(error)
    }
    
}

export default sendEmail