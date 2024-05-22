const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
import { auth } from '../controllers/auth';
import { user } from '../controllers/userController'
import { flock } from '../controllers/flockController'

dotenv.config();

router.use(cookieParser());

router.get('/', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("landingpage", {
        thisUser: undefined,
    } );
});

router.get('/auth', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("auth", {
        title: "Auth",
    } );    
});    

router.post('/login', auth.login);
router.get('/logout', auth.logout);

router.post('/logout', auth.logout);

router.post('/register', auth.register);

router.get('/user-index', auth.verifyToken, user.userIndex);

router.post('/user-delete:id', auth.verifyToken, user.deleteUser);

router.get('/profile', auth.verifyToken, user.userProfile);
router.get('/profile/:id', auth.verifyToken, user.userProfileByMail);

router.get('/flock', auth.verifyToken, flock.indexFlocks);

router.get('/flock/show/:id', auth.verifyToken, flock.showFlock);

router.get('/flock-create', auth.verifyToken, flock.createFlock);
router.post('/flock-create', auth.verifyToken, flock.createFlock);

router.post('/flock-delete:id', auth.verifyToken, flock.deleteFlock);  

// get 404 error page for all urls that were not specified
router.get('*', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("error", {
        title: "404",
    } );
});
  
module.exports = router;