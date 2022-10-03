const sendGridEmail = require('@sendgrid/mail')


sendGridEmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name)=>{
    sendGridEmail.send({
        to: email,
        from: 'khoinp@synodus.com',
        subject: 'Thanks for joining in!',
        text: `Welcome, ${name}'`
    })
}

const sendFarewellEmail = (email, name)=>{
    sendGridEmail.send({
        to: email,
        from: 'khoinp@synodus.com',
        subject: 'Goodbye!',
        text: `Bye, ${name}'`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendFarewellEmail
}

