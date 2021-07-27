import _ from 'lodash';
import bcrypt from 'bcrypt';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import fs from 'fs';
import sequelize from '../mySQLDB';

/**
 * Declaring the datatypes used within the User class
 */
const mappings = {
  id: {
    type: Sequelize.DataTypes.STRING,
    primaryKey: true,
    defaultValue: Sequelize.DataTypes.UUIDV4,
  },
  firstName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.DataTypes.STRING,
    unique: true,
    allowNull: false, 
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false, 
  },
  createdAt: {
    type: Sequelize.DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: Sequelize.DataTypes.DATE,
    allowNull: true,
  },
  userType: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  }
};

/**
 * Defining the user table within the MySQL database using Sequelize
 */
const User = sequelize.define('User', mappings, {
  indexes: [
    {
      name: 'user_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    {
      name: 'user_firstName_index',
      method: 'BTREE',
      fields: ['firstName'],
    },
    {
      name: 'user_lastName_index',
      method: 'BTREE',
      fields: ['lastName'],
    },
    {
      name: 'user_userName_index',
      method: 'BTREE',
      fields: ['userName'],
    },
    {
      name: 'user_password_index',
      method: 'BTREE',
      fields: ['password'],
    },
    {
      name: 'user_createdAt_index',
      method: 'BTREE',
      fields: ['createdAt'],
    },
    {
      name: 'user_updatedAt_index',
      method: 'BTREE',
      fields: ['updatedAt'],
    },
    {
      name: 'user_userType_index',
      method: 'BTREE',
      fields: ['userType'],
    },
    {
      name: 'user_profilePicture_index',
      method: 'BTREE',
      fields: ['profilePicture'],
    }
  ],
});

/**
 * Creates user with bcrypt.
 * @param {*} user
 */

User.createUser = (createdUser) => {
  //Declaring the new User variable to be added
  const newUser =  
  {

    id: createdUser.eID,
    firstName: createdUser.firstName,
    lastName: createdUser.lastName,
    username: createdUser.username,
    password: createdUser.password,
    userType: createdUser.userType,

  };
  

  return new Bluebird((resolve, reject) => {
     //using bcrypt to encrypt the password for the user before saving
     bcrypt.genSalt(10, function (err, salt)
     {
      bcrypt.hash(newUser.password, salt, function (e, hash)
      {
        if(e) reject (e);
        //Checking if the user id already exists
        User.getUserById(newUser.id).then(isUserRegestered => 
          {
          //If user id exists reject user input
          if(isUserRegestered){
            reject ("Employee with ID# " + newUser.id+ " Already Registered");

          }else{
            //Checking if user name already exists
            User.getUserByUserName(newUser.username).then(isUser =>
              {
              //If user name already exists reject user input
              if(isUser){
                reject ("Username " + newUser.username + " Already Taken");

              //If user name and id do not exist add new user to database
              }else{
                newUser.password = hash;
                User.create(newUser).then(() => {
                  resolve("Emplyee With ID# " + newUser.id + " Was Sucessfully Added!");

                }).catch(err => {
                  reject(err);

                });

              }

            });

          }

        });

      });

    });

  });

}

/**
 * Funciton to delete user from database
 * @param {*} id 
 * @returns msg to flash to user
 */
User.deleteUserById = id => {
  return new Bluebird((resolve, reject) => {
    //Check if user exists
    User.getUserById(id).then(foundUser => {
      //If exists delete from database
      foundUser.destroy();
      resolve("User with Employee ID# " + id + " Was Sucessfully Removed From the System!");
    
    }).catch(err => {
      //If dosent exist inform user error occured
      reject("An Error has Occured User with Employee ID# " + id + " Could not be Deleted " + err);

    });

  });

}


/**
 * Function to find user by ID
 * @param {*} id 
 * @returns found user
 */
User.getUserById = id => User.findOne({
    where:{id},
  });


/**
 * Function to find user by first name
 * @param {*} firstName 
 * @returns  found user
 */
User.getUserByFirstName = firstName => User.findOne({
  where: {firstName},
});

/**
 * Function to find user by username
 * @param {*} userName 
 * @returns found user
 */
User.getUserByUserName = userName => User.findOne({
  where: {userName},
});


/**
 * Function to decypt password and check if it is a match
 * @param {*} password 
 * @returns false if password does not match
 */
User.prototype.comparePassword = function (password) {
  return Bluebird.resolve().then(() => 
    bcrypt.compare(password, this.password)).catch(
      (err) => {
        return false;

      }

    );

};

/**
 * Fucntion to update the users profile picture
 * Function saves image to server and sets the image name
 * @param {*} userId 
 * @param {*} username 
 * @param {*} profilePicture 
 */
User.updateProfilePhoto = (userId, username, profilePicture) => {
  //Converting profile picture object to string to be uploaded 
  profilePicture = JSON.stringify(profilePicture).slice(23);

  //Saving profile picture to server
  fs.writeFileSync(`./public/profilePictures/${username}.jpeg`, new Buffer.from(profilePicture, 'base64', (err) => {
    if (err) return console.error(err)
  
  }));

  //Getting the user from database who's profile picture will be updated
  User.getUserById(userId).then(toUpdate => {
    //Updating profile picture name in database
    toUpdate.profilePicture = `${username}.jpeg`;
    //Saving update in database
    toUpdate.save();

  }).catch(err => {
      console.log("This happened " + err);

  });

}

export default User;