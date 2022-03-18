import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import logging from './config/logs';
import config from './config/config';
import userRoutes from './routes/user.route';
import sofaRoutes from './routes/sofa.route';
import mongoose from 'mongoose';

const NAMESPACE = 'Server';
const router = express();

//CONNECTING TO MONGO
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Mongo Connected');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });

//LOG THE REQUEST
router.use((req, res, next) => {

    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

//PARSING THE REQUEST
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//RULES FOR CONNECTING TO TESTE_DO_SOFA WEBAPP
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

//ROTAS
router.use('/sofas', sofaRoutes);
router.use('/users', userRoutes);

//ERROR HANDLING
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));