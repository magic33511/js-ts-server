import http from "http"
import express from "express"
import './config/loggin';
import 'reflect-metadata'

import { loggingHandler } from "./middleware/loggingHandler";
import { corsHandler } from "./middleware/corsHandler";
import { routeNotFound } from "./middleware/routeNotfound";
import { server, mongo} from './config/config';
import { defineRoutes } from "./modules/routes";
import MainController from "./controllers/main";
import mongoose from "mongoose";
import { declareHandler } from "./middleware/declareHandler";
import BookController from "./controllers/book";

export const application = express();
export let httpServer : ReturnType<typeof http.createServer>

export const Main = async () =>{
    logging.info('---------------------------------');
    logging.info('Initial API');
    logging.info('---------------------------------');
    application.use(express.urlencoded({extended:true}))
    application.use(express.json());

    logging.info('---------------------------------');
    logging.info('Connet to Mongo');
    logging.info('---------------------------------');
    try {
        const connection = await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS)
        logging.info('---------------------------------');
        logging.info('Conneted to Mongo', connection.version);
        logging.info('---------------------------------');
    } catch (error) {
        logging.info('---------------------------------');
        logging.info('Unable to Connet to Mongo!');
        logging.error(error)
        logging.info('---------------------------------');
    }

    logging.info('---------------------------------');
    logging.info('Logiing & Configuration');
    logging.info('---------------------------------');
    application.use(loggingHandler);
    application.use(corsHandler);
    application.use(declareHandler);

    logging.info('---------------------------------');
    logging.info('Define Controller Routing');
    logging.info('---------------------------------');
    defineRoutes([MainController,BookController],application)

    logging.info('---------------------------------');
    logging.info('Define Controller Routing');
    logging.info('---------------------------------');
    application.use(routeNotFound);

    logging.info('---------------------------------');
    logging.info('Start Server');
    logging.info('---------------------------------');
    httpServer = http.createServer(application)
    httpServer.listen(server.SERVER_PORT, ()=>{
        logging.log('----------------------------------------');
        logging.log(`Server started on ${server.SERVER_HOSTNAME}:${server.SERVER_PORT}`);
        logging.log('----------------------------------------');
    })
}

export const Shutdown =(callback:any) => http && httpServer.close(callback);

Main();
