import nodemailer from "nodemailer"

export const sendEmail = async ({to = "", message = "", subject = ""}) => {
    // connection config
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth:{
            user: "ahmedzaitoon40@gmail.com",
            pass: process.env.EMAIL_PASS
        }
    })

    let info = await transporter.sendMail({
        from: "ahmedzaitoon40@gmail.com",
        to,
        subject,
        html: message
    })

    console.log(info);
    if(info.accepted.length){
        return true
    }
    return false;
}