import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { logger } from './../../logger';
import { userModel } from './user.model';
import { IUser } from './user.type';
import {Types} from 'mongoose'
export class UserLib {

    public async generateHash(password: string): Promise<string> {

        return bcrypt.hashSync(password, 10);
    }

    public async camparePassword(password: string, hash: string): Promise<boolean> {

        return bcrypt.compareSync(password, hash);
    }

    public async getUsers(): Promise<IUser[]> {
        return userModel.find();
    }

    public async getUserById(id: string): Promise<IUser> {
        return userModel.findById(id);
    }

    public async saveUser(userData: IUser): Promise<IUser> {
        userData.password = await this.generateHash(userData.password);
        const userObj: IUser = new userModel(userData);

        return userObj.save();
    }

    public async getUserByEmail(email: string): Promise<IUser> {
        return userModel.findOne({email: email});
    }

    public async updateUser(userId: string, userData: IUser): Promise<IUser> {
        const user: IUser = await userModel.findById(userId);
        console.log("user",user);
        console.log("user Data",userData);
        user.set(userData);

        return user.save();
    }

    public async deleteUser(id: string): Promise<IUser> {

        return userModel.findOneAndDelete({_id: id});
    }

    public async loginUserAndCreateToken(email: string, password: string): Promise<any> {

        const user: IUser = await this.getUserByEmail(email);
        const isValidPass: boolean = await this.camparePassword(password, user.password);
        if (isValidPass) {
            const token: string = jwt.sign(
                            {id: user._id},
                            'secret',
                            { expiresIn: '24h'},
                        );

            return {user, token};
        } else {
            return false;
        }

    }
    public async addUserComment(reqbody:any):Promise<any>{
        console.log(reqbody);
        const user: IUser = await userModel.findById(reqbody.id);
        console.log(user);
        var userUpdateData=user

        userUpdateData.comment.push(reqbody.comment);
        user.set(userUpdateData);
        // return user;
        return user.save();
        //  const user1: IUser = await userModel.findById(reqbody.id);
        //  const user1 = await userModel.find({comment:{"$in":['Save']}});

        //  return user1;
    }
    public async getUserComment(reqbody:any):Promise<any>{
        const user = await userModel.aggregate([
            {$match:{"_id":Types.ObjectId(reqbody.id)}},
            {$project: {
                comment: {$filter: {
                    input: '$comment',
                    as: 'status',
                    cond: {$eq: ['$$status.status', 'Save']}
                }},
                _id: 0
            }}
        ])
        return user;
    }
    public async updateComment(reqbody:any):Promise<any>{
        console.log(reqbody);
        const user=await userModel.updateOne({
            "_id":Types.ObjectId(reqbody.id),"comment.id":reqbody.comment.id
        },{
            $set:{"comment.$.Text":reqbody.comment.Text}
        })
        return user;
    }
}
