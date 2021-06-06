/**
 * Prints out the message to server console and redirects to user while displaying an error message.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 function init (req, res, redirectPath, msg, err)
 {
     console.error(`\n\n${req.path} failed! \nError: ${err}\n`);
     req.flash('error_msg', msg);
     res.redirect(redirectPath);
 }
 
 module.exports = init;