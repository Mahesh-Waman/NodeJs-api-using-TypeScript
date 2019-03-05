import { Model, model, Schema } from 'mongoose';
import { IUser } from './user.type';

export const userSchema: Schema = new Schema({
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
    name: {
        required: 'Enter a first name',
        type: String,
    },
    userName: {
        required: 'Enter a User Name',
        type: String,
    },
    mobileNo:{
        required:'Enter Mobile Number',
        type: Number,
    },
    comment:{
      
        type:Array
    }
});

export const userModel: Model<IUser> = model<IUser>('User', userSchema);
