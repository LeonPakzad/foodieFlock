const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
import { auth } from '../controllers/auth';
import { user } from '../controllers/userController'

dotenv.config();

router.use(cookieParser());

router.post('/register');
router.post('/login', auth.login);
router.post('/register', auth.register);
router.post('/logout', auth.logout);

router.get('/', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("dashboard", {
        title: "Dashboard",
        thisUser: undefined,
    } );
});

router.post('/user-delete:id', auth.verifyToken, user.deleteUser);

router.get('/user-index', auth.verifyToken, user.userIndex);
router.get('/profile', auth.verifyToken, user.userProfile);
router.get('/profile/:id', auth.verifyToken, user.userProfileByMail);

router.get('/logout', auth.logout);

router.get('/auth', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("auth", {
        title: "Auth",
    } );    
});    

// get 404 error page for all urls that were not specified
router.get('*', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("error", {
        title: "404",
    } );
});
  
module.exports = router;