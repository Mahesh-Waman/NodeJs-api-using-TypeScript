import { Document,Types } from 'mongoose';
export interface IUser extends Document {
    _id:string ;
    password? : string;
    email?: string;
    name?: string;
    usrName?: string;
    created_date?: Date;
    // token?: string;
    mobileNo?:number;
    comment?:Array<any>;
}
