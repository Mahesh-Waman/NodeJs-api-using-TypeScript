"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    password: {
        type: String,
    },
    created_date: {
        default: Date.now,
        type: Date,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    first_name: {
        required: 'Enter a first name',
        type: String,
    },
    last_name: {
        required: 'Enter a last name',
        type: String,
    },
});
exports.userModel = mongoose_1.model('User', exports.userSchema);
