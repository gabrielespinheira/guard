"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = exports.verify = exports.generate = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var Auth = (function () {
    function Auth() {
        var _a, _b, _c;
        this.signature = (_a = process.env.TOKEN_SIGNATURE) !== null && _a !== void 0 ? _a : 'secret';
        this.algorithm = (_b = process.env.ALGORITHM) !== null && _b !== void 0 ? _b : 'HS256';
        this.expires = (_c = process.env.EXPIRES) !== null && _c !== void 0 ? _c : '1d';
    }
    Auth.prototype.generate = function (email) {
        try {
            var token = jsonwebtoken_1.default.sign({ email: email }, this.signature, {
                algorithm: this.algorithm,
                expiresIn: this.expires,
            });
            return token;
        }
        catch (err) {
            throw new Error(err.message);
        }
    };
    Auth.prototype.verify = function (token) {
        try {
            var isValidToken = jsonwebtoken_1.default.verify(token, this.signature);
            return isValidToken;
        }
        catch (err) {
            throw new Error(err.message);
        }
    };
    return Auth;
}());
var generate = function (email) {
    var auth = new Auth();
    try {
        return auth.generate(email);
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.generate = generate;
var verify = function (token) {
    var auth = new Auth();
    try {
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
