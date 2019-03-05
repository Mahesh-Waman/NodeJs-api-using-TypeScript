import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as mongoose from 'mongoose';
import { logger } from './src/logger';
import { registerRoutes } from './src/routes';

export class App {

    public express: express.Application;
    public mongoUrl: string = 'mongodb://localhost:27017/firstapp';
    public httpServer: http.Server;

    public async init(): Promise <void> {
        this.express = express();
        this.httpServer = http.createServer(this.express);

        this.middleware();
        this.setupRoutes();
        this.mongoSetup();
        logger.warn('logger called from app');
    }

    private middleware(): void {

        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }

    private setupRoutes(): void {
        registerRoutes(this.express);
    }
    private mongoSetup(): void {
        mongoose.connect(this.mongoUrl);
    }
}
