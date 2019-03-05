"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user_model_1 = require("./user.model");
class UserLib {
    generateHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.hashSync(password, 10);
        });
    }
    camparePassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.compareSync(password, hash);
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.find();
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findById(id);
        });
    }
    saveUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            userData.password = yield this.generateHash(userData.password);
            const userObj = new user_model_1.userModel(userData);
            return userObj.save();
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findOne({ email: email });
        });
    }
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.userModel.findById(userId);
            user.set(userData);
            return user.save();
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.userModel.findOneAndDelete({ _id: id });
        });
    }
    loginUserAndCreateToken(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserByEmail(email);
            const isValidPass = yield this.camparePassword(password, user.password);
            if (isValidPass) {
                const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '24h' });
                return { user, token };
            }
            else {
                return false;
            }
        });
    }
}
exports.UserLib = UserLib;
