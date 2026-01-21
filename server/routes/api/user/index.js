const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const controller = require("./user");


function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing', message: 'Token missing' });
        }

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Not authorized', message: 'Invalid token or exprired' });
            } else {
                res.locals.id = decoded.id;
                res.locals.firstName = decoded.firstName;
                res.locals.lastName = decoded.lastName;
                return next();
            }
        })
    } catch (err) {
        console.error('Error occured in middleware', err)
        return res.status(403).json({ error: "Not authorized", message: "Invalid token or expired" });
    }
}

router.post('/register', controller.registerUser);

module.exports = router;