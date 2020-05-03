const validator = require('express-validator');
const apiResponse = require('./apiresponse');

exports.validate_login = [
    validator.check('email').not().isEmpty().withMessage('email must not be empty'),
    validator.check('password').not().isEmpty().withMessage('password must not be empty'),
    (req, res, next) => {
        let errors = validator.validationResult(req).array();
        if (errors.length != 0) {
            return apiResponse.ErrorResponse(res, errors[0].msg);
        } else next()
    }
];

exports.validate_signup = [
    validator.check('name').not().isEmpty().withMessage('name must not be empty'),
    validator.check('password').not().isEmpty().withMessage('password must not be empty'),
    validator.check('email').not().isEmpty().withMessage('email must not be empty'),
    (req, res, next) => {
        let errors = validator.validationResult(req).array();
        if (errors.length != 0) {
            return apiResponse.ErrorResponse(res, errors[0].msg);
        } else next()
    }
];

exports.validate_list = [
    validator.check('list_name').not().isEmpty().withMessage('list name must not be empty'),
    validator.check('description').not().isEmpty().withMessage('description must not be empty'),
    validator.check('domain').not().isEmpty().withMessage('domain must not be empty'),
    validator.check('company').not().isEmpty().withMessage('company must not be empty'),
    validator.check('website_url').not().isEmpty().withMessage('website_url must not be empty'),
    (req, res, next) => {
        let errors = validator.validationResult(req).array();
        if (errors.length != 0) {
            return apiResponse.ErrorResponse(res, errors[0].msg);
        } else next()
    }
];