const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)


sgMail.send({
    to: 'alokd4973@gmail.com',
    from: 'alokd4973@gmail.com',
    subject: 'This is my first creation!',
    text: 'I hope this one actually get to you.'
})

s2._domainkey.alok

s2.domainkey.u18499103.wl104.sendgrid.net