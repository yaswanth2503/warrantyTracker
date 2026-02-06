const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const ENV = process.env.NODE_ENV || "development";
const helpers = require('../helpers/helper');
const SECRET = process.env.JWT_SECRET;

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/register', async (req, res) => {
    try {
        const { firstName = '', lastName = '', email = '', password = '', username = ''} = req.body;

        if (!firstName.trim()) {
            return res.status(400).json({ success: false, error: 'FirstName is missing' });
        }

        if (!lastName.trim()) {
            return res.status(400).json({ success: false, error: 'LastName is missing' });
        }

        if (!username.trim()) {
            return res.status(400).json({ success: false, error: 'Username is missing' });
        }

        if (!email.trim()) {
            return res.status(400).json({ success: false, error: 'Email is missing' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
        }

        if (!helpers.isValidEmail(email)) {
            return res.status(400).json({ success: false, error: "Invalid email format" });
        }

        const existingUser = await models.User.findOne({
            attributes: ['id', 'username'],
            where: {
                username: {
                    [Op.iLike]: username
                }
            },
            raw: true
        })

        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Username already taken' })
        }
        
        await models.User.create({
            firstName: firstName,
            lastName: lastName,
            username,
            email: email.toLowerCase(),
            password,
        });

        return res.status(201).json({ success: true, message: 'The user has been registered successfully' });    
    } catch (err) {
        console.error('error in /api/users/register', err);
        return res.status(500).json({ success: false, error: 'Unable to register' });
    }
})

router.post('/login', async (req, res) => {
    try{
        const { username = '', password = '' } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username or password is missing' });
        }

        const user = await models.User.findOne({
            attributes: ['id', 'username', 'password'],
            where: {
                username: {
                    [Op.iLike]: username
                }
            },
            raw: true
        });

        if(!user) {
            return res.status(404).json({ success: false, error: 'User not found, provide the correct username' });
        }

        const validatePassword = await bcrypt.compare(password, user?.password);
        if(!validatePassword) {
            return res.status(400).json({ success: false, error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, firstName: user.firstName, lastName: user.lastName },
            SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure:  ENV != 'development'
        });

        res.redirect('/dashboard');

    } catch (err) {
        console.error('error in /api/users/login', err);
        return res.status(500).json({ success: false, error: 'Unable to login' });
    }
})

router.get('/logout', async (req, res) => {
    try {
		res.clearCookie('token');
    	res.redirect('/login');  
    } catch (err) {
        console.error('error in /api/users/logout', err);
        return res.status(500).json({ success: false, error: 'Unable to logout' });
    } 
})


router.use((req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, SECRET);
		res.locals.id = decoded.id;
        res.locals.username = decoded.username;
		res.locals.firstName = decoded.firstName;
		res.locals.lastName = decoded.lastName;
        next();
    } catch (err) {
        console.error('Authentication failed:', err);
        return res.redirect('/login');
    }
});

module.exports = router;
