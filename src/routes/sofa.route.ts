import express from 'express';
import controller from '../controllers/sofa.controllers';

const sofaRouter = express.Router();

sofaRouter.post('/create', controller.create);
sofaRouter.put('/update', controller.update);
sofaRouter.get('/', controller.getAllSofas);
sofaRouter.patch('/report', controller.reportSofa);
sofaRouter.delete("/:_id", controller.deleteSofa);
sofaRouter.get("/last", controller.getLastSofa);

export = sofaRouter;