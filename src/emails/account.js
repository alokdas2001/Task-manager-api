const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(SENDGRID_API_KEY); 

// sending welcome Email
const sendWelcomeEmail = (email , name) =>{
    sgMail.send({
    to:email,
    from: 'alokd4973@gmail.com',
    subject: 'Thanks for joining us',
    text: `welcome to our site ${name}`  
  })
    
}


// sending cancelation Email
const sendCancelationEmail = (email , name) => {
    sgMail.send({
      to:email,
      from: 'alokd4973@gmail.com',
      subject: 'Cancelation Message',
      text: `Good Bye ${name} , hope we will see you soon`  
  })
} 

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
