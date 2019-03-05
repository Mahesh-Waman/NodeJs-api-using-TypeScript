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

    public async getUsers(req:any): Promise<any> {
        console.log("Get Users");
        let res:any;
        const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                console.log(bearer[1]);
             return jwt.verify(bearer[1], 'secret',async (err:any, user:any) => {
                    if (err) {
                        console.error(err);
                        return err;
                        // return await res.json({
                        //     success: false,
                        //     message: 'Failed to authenticate token.'
                        // });
                    } else {
                        return userModel.find();

                    }
                });
            }
            else {
               
                let err={
                    success: false,
                    message: 'No token provided.'
                }
                return err;
                // await res.status(403).send({
                //     success: false,
                //     message: 'No token provided.'
                // });
            }
    }

    public async getUserById(req: any): Promise<any> {
        let res:any;
        const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                console.log(bearer[1]);
             return jwt.verify(bearer[1], 'secret',async (err:any, user:any) => {
                    if (err) {
                        console.error(err);
                        return err;
                       
                    } else {
                        return userModel.findById(req.params.id);

                    }
                });
            }
            else {
                let err={
                    success: false,
                    message: 'No token provided.'
                }
                return err;
            }
    }

    public async saveUser(userData: IUser): Promise<IUser> {
        userData.password = await this.generateHash(userData.password);
        const userObj: IUser = new userModel(userData);

        return userObj.save();
    }

    public async getUserByEmail(email: string): Promise<IUser> {
        return userModel.findOne({email: email});
    }

    public async updateUser(req:any,userId: string, userData: IUser): Promise<any> {
        let res:any;
        const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                console.log(bearer[1]);
             return jwt.verify(bearer[1], 'secret',async (err:any, user:any) => {
                    if (err) {
                        console.error(err);
                        return err;
                     
                    } else {
                        const user: IUser = await userModel.findById(userId);
        console.log("user",user);
        console.log("user Data",userData);
        user.set(userData);

        return user.save();
                    }
                });
            }
            else {
                let err={
                    success: false,
                    message: 'No token provided.'
                }
                return err;
            }
        
    }

    public async deleteUser(req: any): Promise<any> {
         let res:any;
        const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                console.log(bearer[1]);
             return jwt.verify(bearer[1], 'secret',async (err:any, user:any) => {
                    if (err) {
                        console.error(err);
                        return err;
                       
                    } else {
                        return userModel.findOneAndDelete({_id: req.params.id});
                    }
                });
            }
            else {
                let err={
                    success: false,
                    message: 'No token provided.'
                }
                return err;
            }
        

        
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
    public async addUserComment(req:any,reqbody:any):Promise<any>{
        let res:any;
        const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                console.log(bearer[1]);
             return jwt.verify(bearer[1], 'secret',async (err:any, user:any) => {
                    if (err) {
                        console.error(err);
                        return err;
                       
                    } else {
                        console.log(reqbody);
                        const user: IUser = await userModel.findById(reqbody.id);
                        console.log(user);
                        var userUpdateData=user
                
                        userUpdateData.comment.push(reqbody.comment);
                        user.set(userUpdateData);
                        
                        return user.save();
                    }
                });
            }
            else {
                let err={
                    success: false,
                    message: 'No token provided.'
                }
                return err;
            }
        
       
    }
    public async getUserComment(req:any,reqbody:any):Promise<any>{
        let res:any;
        const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                console.log(bearer[1]);
             return jwt.verify(bearer[1], 'secret',async (err:any, user:any) => {
                    if (err) {
                        console.error(err);
                        return err;
                        
                    } else {
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
                });
            }
            else {
                let err={
                    success: false,
                    message: 'No token provided.'
                }
                return err;
            }
       
    }
    public async updateComment(req:any,reqbody:any):Promise<any>{
        let res:any;
        const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                console.log(bearer[1]);
             return jwt.verify(bearer[1], 'secret',async (err:any, user:any) => {
                    if (err) {
                        console.error(err);
                        return err;
                      
                    } else {
                        console.log("Else condition 123456789");
                        console.log(reqbody.id);
                        console.log(reqbody.comment.id);
                        console.log(reqbody.comment.Text);
                        const  user= await userModel.updateOne({
                            "_id":Types.ObjectId(reqbody.id),"comment.id":reqbody.comment.id
                        },{
                            $set:{"comment.$.Text":reqbody.comment.Text}
                        })
                        return user;
                    }
                });
            }
            else {
                let err={
                    success: false,
                    message: 'No token provided.'
                }
                return err;
            }
       
    }
}
