const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();



const Registration = mongoose.model('Registration');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});


router.get('/', (req, res) => {
  //res.send('It works!');
  res.render('index', { title: 'Simple Kitchen' });
});

router.get('/register', (req, res) => {
  //res.send('It works!');
  res.render('register', { title: 'Registration form' });
});


router.get('/registrants',
basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('registrants', { title: 'Listing registrations', registrations:registrations });
    })
    .catch(() => { 
      res.send('Sorry! Something went wrong.'); 
    });
}));


router.post('/', 
    [
        check('name')
        .isLength({ min: 1 })
        .withMessage('Please enter a name'),
        check('email')
        .isLength({ min: 1 })
        .withMessage('Please enter an email'),
    ],
    (req, res) => {
        //console.log(req.body);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          const registration = new Registration(req.body);
          registration.save()
            .then(() => {res.render('thankyou',{title:'Thank you!'});})
            .catch((err) => {
              console.log(err);
              res.send('Sorry! Something went wrong.');
            });
          } else {
            res.render('register', { 
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
             });
          }

      async(req, res) => {
        //console.log(req.body);
        const errors=validationResult(req);
        if(errors.isEmpty()) {
          const registration=new Registration(req.body);
          //generate salt to hash password
          const salt=await bcrypt.genSalt(10);
          //set user password to hash password
          registration.password=await bcrypt.hash(registration.password,salt);
          registration.save();
        }
      }
    });

module.exports = router;
