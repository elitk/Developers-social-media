const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator')
const config = require('config')
// @route Get auth/users

// @desc test routes 

// @access Public 
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('server error')
    }
})

// @route POST api/auth

// @desc auth user && get token 

// @access Public 
router.get('/', (req, res) => res.send('users Route'))

router.post('/',
    [
        check('email', 'please include a valid email').isEmail(),
        check('password', 'password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] })
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'invalid credentials' }] })

            }     


            const payload = {
                user: {
                    id: user.id,
                    name: user.name
                }
            }
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });
        } catch (error) {
            console.error(error.message)
            return res.status(500).send('server error')

        }
    });

module.exports = router
