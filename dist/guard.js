"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = exports.verify = exports.generate = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var auth_1 = __importDefault(require("./auth"));
dotenv_1.default.config();
var generate = function (email) {
    try {
        var auth = new auth_1.default();
        return auth.generate(email);
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.generate = generate;
var verify = function (token) {
    try {
        var auth = new auth_1.default();
        return auth.verify(token);
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.verify = verify;
var guard = function (req, res, next) {
    try {
        var authorization = req.headers.authorization.trim();
        var token = authorization.replace('Bearer ', '');
        var isValidToken = (0, exports.verify)(token);
        if (!isValidToken) {
            throw new Error('Token not valid');
        }
        req.token = isValidToken;
        req.user_email = isValidToken.email;
        next();
    }
    catch (err) {
        console.warn('Not authorized:', err.message);
        return res.status(401).json({ status: 'error', message: 'Not authorized' });
    }
};
exports.guard = guard;
exports.default = exports.guard;
