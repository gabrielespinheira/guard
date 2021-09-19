"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var Auth = (function () {
    function Auth() {
        var _a, _b, _c;
        this.signature = (_a = process.env.GUARD_SIGNATURE) !== null && _a !== void 0 ? _a : 'secret';
        this.algorithm = (_b = process.env.GUARD_ALGORITHM) !== null && _b !== void 0 ? _b : 'HS256';
        this.expires = (_c = process.env.GUARD_EXPIRESIN) !== null && _c !== void 0 ? _c : '15d';
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
exports.default = Auth;
