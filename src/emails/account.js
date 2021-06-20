const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeEmail = (email, name) =>{
    sgMail.send({
        to:email,
        from:'bicolasnera@gmail.com',
        subject:`Thanks for joining, ${name}!`,
        templateId:'d-882299a238854c35b77158bfece7077d',
        JSON:{
            "name":name
        }
    })
}

const goodbyeEmail = (email, name)=>{
    sgMail.send({
        to:email,
        from:'bicolasnera@gmail.com',
        subject:`Goodbye ${name}!`,
        templateId:'d-2df905a7f8f940ca941a0404ed9b7e89',
        JSON:{
            "name":name
        }
    })
}

module.exports = {
    welcomeEmail,
    goodbyeEmail
}