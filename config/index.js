module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  mailerHost: process.env.MAILERHOST || 'smtp.ethereal.email',
  mailerPort: process.env.MAILERPORT || 587,
  mailerSecure: process.env.MAILERSECURE || false,
  mailUser: process.env.MAILUSER,
  mailPass: process.env.MAILPASS,
};
