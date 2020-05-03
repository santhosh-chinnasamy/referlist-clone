const jwt = require('jsonwebtoken');
const User = require('../models/user').User;
const auth = async (req, res, next) => {
    const accessToken = req.headers['x-access-token'];
    if (accessToken) {
        try {
            const {
                userId,
                exp
            } = jwt.verify(accessToken, process.env.JWT_SECRET);
            if (exp < Date.now().valueOf() / 1000) {
                res.json({
                    status: 199,
                    message: "JWT token has expired, please login to obtain a new one"
                });
                return
            }

            const user = await User.findById(userId);
            if (!user) {
                res.json({
                    status: 199,
                    message: "Authentication failed"
                });
                return
            }
            req.user = user;
            req.token = accessToken;
            next()
        } catch (error) {
            res.json({
                status: 199,
                message: 'Token verification failed'
            });
        }
    }
}