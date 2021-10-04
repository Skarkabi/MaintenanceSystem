var nodemailer = require('nodemailer');

function emailConfirmation(fields)
{
    var transporter = nodemailer.createTransport({
        /*service: 'mail.tmico.ae',
        auth: {
          user: 'skarkabi@tmico.ae',
          pass: '199Sk2018'
        }
      });*/
      service: 'kerio',
      host: 'mail.tmico.ae',
      secure: 'true',
      port: '465',
      auth: {
        user: 'maintenance@tmico.ae', //For example, xyz@gmail.com
        pass: '4211ma2019'
     }
    });

      var mailOptions = {
        from: 'maintenance@tmico.ae',
        to: fields.email,
        subject: `Weekly Minimum Stock Count as of ${new Date().toDateString()}`,
        text: fields.report
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("SendMail error:", error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {emailConfirmation: emailConfirmation,};
