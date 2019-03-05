import { Application, Request, Response,NextFunction } from 'express';
import { BaseCotroller } from '../BaseApi';
import { logger } from './../../logger';
import { UserLib } from './user.lib';
import { IUser } from './user.type';

export class UserApi extends BaseCotroller {

    constructor() {
        super();
        this.init();
    }

    public register(express: Application) : void {
        express.use('/api/users', this.router);
    }

    public async getUsers(req: Request, res: Response): Promise<void> {
        console.log("welcome");
        try {
            const user: UserLib = new UserLib();
            const users: IUser[] = await user.getUsers(req);
            res.send(users);
        } catch (err) {
            logger.info(JSON.stringify({'json data': err}));
            res.send(err);
        }
    }

    public async getUserById(req: Request, res: Response): Promise <void> {
        try {
            logger.info(JSON.stringify({'user callled' : req.params}));
            const user: UserLib = new UserLib();
            const userDetails: IUser = await user.getUserById(req);
            res.json(userDetails);
        } catch (err) {
            res.send(err);
        }
    }

    public async addUser(req: Request, res: Response): Promise<void> {
        try {
            const user: UserLib = new UserLib();
            const userData: IUser = req.body;
            const userResult: IUser = await user.saveUser(userData);
            res.send(userResult);
        } catch (err) {
            logger.info(err);
            res.send(err);
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.params && req.params.id;
            logger.info(`userId ${userId}`);
            const userData: IUser = req.body;
            const user: UserLib = new UserLib();
            const updatedUserResult: IUser = await user.updateUser(req,userId, userData);
            logger.info('user updated');
            res.send(updatedUserResult);
        } catch (err) {
            logger.info('update called failed');
            res.send(err);
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<any> {
        try {
            const user: UserLib = new UserLib();
            logger.info(`id ${req.params.id}`);
            logger.info('delete');

            const deletedUser: any = user.deleteUser(req);
            res.send(deletedUser);
        } catch (err) {
            logger.info(JSON.stringify(`delete err ${err}`));
            res.send(err);
        }
    }

    public async login(req: Request, res: Response,nxt:NextFunction): Promise <void> {
        try {
            const user: UserLib = new UserLib();
            const {email, password} = req.body;
            const loggedInUser: any = await user.loginUserAndCreateToken(email, password);
            if (loggedInUser.token) {
                logger.info(JSON.stringify({'loggedI nUser ': loggedInUser}));
                res.send(loggedInUser);
            } else {
                res.status(401).send({message: 'Invalid login details'});
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public async addUserComment(req:Request,res:Response):Promise<void>{
        try{
            const user:UserLib = new UserLib();
            const updatedUserResult: IUser = await user.addUserComment(req,req.body);
            logger.info('user Comment Added');
            res.send(updatedUserResult);
        }
        catch(err){
            res.status(400).send(err);
        }
    }

    public async getUserComment(req:Request,res:Response):Promise<void>{
        try{
            const user:UserLib = new UserLib();
            const getUserResult: IUser = await user.getUserComment(req,req.body);
            logger.info('user Result Get');
            res.send(getUserResult);
        }
        catch(err){
            res.status(400).send(err);
        }
    }
    public async updateuserComment(req:Request,res:Response):Promise<void>{
        try{
            

            const user:UserLib=new UserLib();
            const updatedUserResult=await user.updateComment(req,req.body);
            logger.info('user comment updated');
            console.log(updatedUserResult);
            res.send(updatedUserResult)

        }
        catch(err){
            // console.log("main function error");
            // console.log(err);
            res.status(400).send(err);
        }
    }

    public verifyToken(req:Request,res:Response,nxt:NextFunction){
         // get auth header value
    console.log(req.headers);
    const bearerHeader=req.headers['authorization'];
    console.log(bearerHeader);
    // check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        // split at the space
        const bearer = bearerHeader.split(' ');
        // get token from array
        const bearerToken=bearer[1];
        // set the token
        // req.token=bearerToken
        // next middleware
        nxt();

    }
    else{
        res.status(403).send("Authentication token not passed")
    }
    }

    public init(): void {
        this.router.get('/', this.getUsers);
        this.router.get('/:id', this.getUserById);
        this.router.post('/', this.addUser);
        this.router.put('/:id', this.updateUser);
        this.router.delete('/:id', this.deleteUser);
        this.router.post('/login', this.login);
        this.router.post('/comment',this.addUserComment);
        this.router.post('/getComment',this.getUserComment);
        this.router.post('/updateComment',this.verifyToken,this.updateuserComment);
    }
}
