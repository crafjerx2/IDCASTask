const nodeMailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const util = require('util')
const emailConfig = require('../config/email')

console.log({ emailConfig })

let transport = nodeMailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: true,
    auth: {
      user: emailConfig.user, 
      pass: emailConfig.pass, 
    }}
) 

const generateHtml = (fileHtml, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${fileHtml}.pug`, options)
    return juice(html)
}

exports.send = async (props) => {
    const from = '"IDCASTask" <no-reply@idasktask.com>'
    const { user: { email }, subject, fileHtml } = props
    const html = generateHtml(fileHtml, props)
    const text = htmlToText.convert(html)

    let emailOptions = {
        from, 
        to: email,
        subject,
        text,
        html
    }

    const sendEmail = util.promisify( transport.sendMail, transport)
    return sendEmail.call(transport, emailOptions)
}



