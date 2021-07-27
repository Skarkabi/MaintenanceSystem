import express from 'express';
import User from '../models/User';

const router = express.Router();

/** 
 * Express Route to display sleected user information
 */
router.get('/display-user/:id', (req,res,next) => {
    //Checking if the logged in user has permission to view this info
    if(req.user.id == req.params.id || req.user.admin)
    {
        let msg = req.flash();
        User.getUserById(req.params.id).then(foundUser => {
            res.render('displayUser', {
                title: (`${foundUser.firstName} ${foundUser.lastName}'s Page`),
                jumbotronDescription: `This is ${foundUser.firstName} ${foundUser.lastName}'s profile page.`,
                existingUser: foundUser,
                showPii: req.user.admin || req.user.id == req.params.id,
                msgType: msg

            });

        });

    }else{
        req.flash('error_msg', "You do not have access to this page.");
        res.render("accessDenied", {
            title: "Access Denied",
            msgType: req.flash()

        });

    }
    
});

router.get('/display-user/', (req,res,next) =>
{
    console.log(req.user.id)
    if(req.user.id == req.params.id || req.user.admin)
    {
        let msg = req.flash();
        User.getUserById(req.params.id).then(foundUser => {
            res.render('displayUser', {
                title: (`${foundUser.firstName} ${foundUser.lastName}'s Page`),
                jumbotronDescription: `This is ${foundUser.firstName} ${foundUser.lastName}'s profile page.`,
                existingUser: foundUser,
                showPii: req.user.admin || req.user.id == req.params.id,
                msgType: msg
            });
        });
    }else{
        req.flash('error_msg', "You do not have access to this page.");
        res.render("accessDenied", {
            title: "Access Denied",
            msgType: req.flash()
        });
    }
});

router.get('/', async (req, res, next) => 
{
    if (req.user.admin)
    {
        User.findAndCountAll().then(users => {
            console.log("here: " + JSON.stringify(users.count));
            var entriesNum = []; 
            for(var i = 0; i < users.count; i++){
                entriesNum[0] = i + 1;
                
            }
            res.render("displayUsers", {
                title: "Users",
                jumbotronDescription: "View all user accounts for professors, students and admins registered in the university's system.",
                users: users.rows,
                user: req.user,
                msgType: req.flash()
            });
        });
    }
    else
    {
        req.flash('error_msg', "You do not have access to this page.");
        res.render("accessDenied", {
            title: "Access Denied",
            msgType: req.flash()
        });
    }
});

router.get('/edit/:id', async(req, res, next) => {
    res.render('editProfilePicture', {
        title: 'editUser',
        jumbotronDescription: `Edit Profile Picture.`,
        msgType: req.flash()

    });
})

router.post('/edit/:id', (req,res,next) =>{
    User.updateProfilePhoto(req.user.id, req.user.username, req.body.image);
    res.redirect('back');
})

/**
 * Displays create user page.
 */
 router.get('/create', async (req, res, next) =>
 {
     if(req.user.admin){
        res.render('createUpdateUser', {
            title: 'Create New User',
            jumbotronDescription: `Register a new user account.`,
            submitButtonText: 'Create',
            action: "/users/create",
            msgType: req.flash()

        });
     }else{
        req.flash('error_msg', "You do not have access to this page.");
        res.render("accessDenied", {
            title: "Access Denied",
            msgType: req.flash()
        });
     }
     
        
    
 });

 router.get('/delete/:id', (req, res, next) =>
{
    if(req.user){
        User.deleteUserById(req.params.id).then(output => {
            req.flash('success_msg', output);
            res.redirect(`/users`);

        }).catch(err => {
            req.flash('error_msg', err);
            res.redirect(`/users/display-user/${req.params.id}`);

        });
    }
    
});
 
 /**
  * Creates an user.
  */
 router.post('/create', (req, res, next) =>{   
    User.createUser(req.body).then(output => {
        req.flash('success_msg', output);
        res.redirect('/users/create')

    }).catch(err => {
        req.flash('error_msg', err);
        res.redirect('/users/create')
            
    });

});
 
export default router;

