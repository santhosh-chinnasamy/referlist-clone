const jwt = require('jsonwebtoken');
const User = require('../models/user').User;
const apiResponse = require('../_helpers/apiresponse');

const auth = async (req, res, next) => {
    const accessToken = req.headers['x-access-token'];
    if (accessToken) {
        try {
            const {
                userId,
                exp
            } = jwt.verify(accessToken, process.env.JWT_SECRET);
            if (exp < Date.now().valueOf() / 1000) {
                return apiResponse.ErrorResponse(res, "JWT token has expired, please login to obtain a new one");
            }

            const user = await User.findById(userId);
            if (!user) return apiResponse.ErrorResponse(res, "Authentication failed");

            req.user = user;
            req.token = accessToken;
            next()
        } catch (error) {
            return apiResponse.ErrorResponse(res, "Token verification failed");
        }
    }
}