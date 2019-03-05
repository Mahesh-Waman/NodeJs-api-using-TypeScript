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
const BaseApi_1 = require("../BaseApi");
const logger_1 = require("./../../logger");
const user_lib_1 = require("./user.lib");
class UserApi extends BaseApi_1.BaseCotroller {
    constructor() {
        super();
        this.init();
    }
    register(express) {
        express.use('/api/users', this.router);
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_lib_1.UserLib();
                const users = yield user.getUsers();
                res.send(users);
            }
            catch (err) {
                logger_1.logger.info(JSON.stringify({ 'json data': err }));
                res.send(err);
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info(JSON.stringify({ 'user callled': req.params }));
                const user = new user_lib_1.UserLib();
                const userDetails = yield user.getUserById(req.params.id);
                res.json(userDetails);
            }
            catch (err) {
                res.send(err);
            }
        });
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_lib_1.UserLib();
                const userData = req.body;
                const userResult = yield user.saveUser(userData);
                res.send(userResult);
            }
            catch (err) {
                logger_1.logger.info(err);
                res.send(err);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params && req.params.id;
                logger_1.logger.info(`userId ${userId}`);
                const userData = req.body;
                const user = new user_lib_1.UserLib();
                const updatedUserResult = yield user.updateUser(userId, userData);
                logger_1.logger.info('user updated');
                res.send(updatedUserResult);
            }
            catch (err) {
                logger_1.logger.info('update called failed');
                res.send(err);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_lib_1.UserLib();
                logger_1.logger.info(`id ${req.params.id}`);
                logger_1.logger.info('delete');
                const deletedUser = user.deleteUser(req.params.id);
                res.send(deletedUser);
            }
            catch (err) {
                logger_1.logger.info(JSON.stringify(`delete err ${err}`));
                res.send(err);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new user_lib_1.UserLib();
                const { email, password } = req.body;
                const loggedInUser = yield user.loginUserAndCreateToken(email, password);
                if (loggedInUser.token) {
                    logger_1.logger.info(JSON.stringify({ 'loggedI nUser ': loggedInUser }));
                    res.send(loggedInUser);
                }
                else {
                    res.status(401).send({ message: 'Invalid login details' });
                }
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    init() {
        this.router.get('/', this.getUsers);
        this.router.get('/:id', this.getUserById);
        this.router.post('/', this.addUser);
        this.router.put('/:id', this.updateUser);
        this.router.delete('/:id', this.deleteUser);
        this.router.post('/login', this.login);
    }
}
exports.UserApi = UserApi;
