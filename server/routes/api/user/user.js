const models = require('../../../models');
const bcrypt = require('bcrypt');
const helpers = require('../../../helpers/helper')

module.exports.registerUser = async (req, res) => {
    try {
        const { firstName = '', lastName = '', email = '', password = ''} = req.body;

        if (!firstName) {
            return res.status(400).json({ success: false, error: 'firstName is missing' });
        }

        if (!lastName) {
            return res.status(400).json({ success: false, error: 'lastName is missing' });
        }

        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is missing' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
        }

        if (!helpers.isValidEmail(email)) {
            return res.status(400).json({ success: false, error: "Invalid email format" });
        }

        const username = `${firstName.trim()}${lastName.trim()}`;
        
        await models.User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            username,
            email: email.trim().toLowerCase(),
            password,
        });

        return res.status(201).json({ success: true, message: 'The user has been registered successfully' });    
    } catch (err) {
        console.error('/api/users/registerUser', err);
        return res.status(500).json({ success: false, error: 'Unable to register user' });
    }
}