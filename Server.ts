import * as dotenv  from 'dotenv';
import * as http from 'http';
import { App } from './App';
import { logger } from './src/logger';

dotenv.config();

const PORT: number = 3000;
const app: App = new App();
let server: http.Server;

//calling init functions starts server
app.init().then(() => {
    logger.info('called init');
    app.express.set('port', PORT);
    server = app.httpServer;
    server.on('error', serverError);
    server.on('listening', serverListening);
    server.listen(PORT);
}).catch((err: Error) => {
    logger.info('app.init error');
    logger.error(err.name);
    logger.error(err.message);
    logger.error(err.stack);
});

function serverError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }
    throw error;
}

function serverListening(): void {
    logger.info(`Server listening on : ${PORT}`);
}

process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Promise Rejection: reason:', reason.message);
    logger.error(reason.stack);
    // application specific logging, throwing an error, or other logic here
    process.exit(1);
});
