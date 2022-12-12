let nodemailer = require('nodemailer')
let config = require('../config')

async function createTransporter(){
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.mailUser || testAccount.user,
      pass: config.mailPass || testAccount.pass
    }
  });

  return transporter

}

async function sendVerificationEmail(userEmail, isNewUser, token) {
  const transporter = await createTransporter()

  let subject = isNewUser ? 'Potwierdź włączenie powiadomień' : 'Potwierdź zmianę dotyczącą powiadomień'
  let text = isNewUser ? 'Kliknij w link aby wyrazić zgodę na otrzymywanie powiadomień email, przypominających o wystawieniu śmieci' : 'Kliknij w link aby zatwierdzić dokonaną zmianę dotyczącą wysyłania powiadomień na email'
  let link = `http://localhost:3001/api/verify?token=${token}`

  const info = await transporter.sendMail({
    from: 'noreply@jutrosmieci.pl',
    to: userEmail,
    subject: subject,
    text: text,
    html: text + '<br/>' + '<a href=' + link + '>Kliknij tutaj</a>'
  });

  console.log('Wiadomość wysłana do: ' + userEmail);
  console.log('Podgląd -> ', nodemailer.getTestMessageUrl(info));
}

async function sendNotification(email, types, ileWczesniej) {
  const transporter = await createTransporter()

  let subject = "[Przypomnienie] Wystaw śmieci"
  let when = ileWczesniej.substring(0,1) == 1 ? "jutro: " : `za ${ileWczesniej.substring(0,1)} dni: `
  let typeLabels = () => {
    let string = ""
    let labels = {plastik: "Tworzywa sztuczne", szklo: "Szkło", papier: "Papier", zmieszane: "Zmieszane", bio: "Biodegradowalne", gabaryt: "Wielkogabarytowe"}
    types.map(type => {
      string += "<br><b>• " + labels[type] + "</b> "
    })
    return string
  }
  let text = "Przygotuj następujące śmieci do odbioru " + when + typeLabels()

  const info = await transporter.sendMail({
    from: 'noreply@jutrosmieci.pl',
    to: email,
    subject: subject,
    text: text,
    html: text
  });

  console.log('Wysłane powiadomienie - Podgląd -> ', nodemailer.getTestMessageUrl(info));
}


exports.sendVerificationEmail = sendVerificationEmail;
exports.sendNotification = sendNotification;
