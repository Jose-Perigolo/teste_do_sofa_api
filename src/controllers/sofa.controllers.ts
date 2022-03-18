import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Sofa from '../models/sofa.model';

interface UploadRequest extends Request {
    sofa: {
        _id: string;
    }
}

const update = async (req: UploadRequest, res: Response, next: NextFunction) => {
    const { imageUrl, type, seats, length, width, depth, _id } = req.body;

    const update = { imageUrl, type, seats, length, width, depth }

    Sofa.findOneAndUpdate({ _id: _id }, update, { new: true })
        .exec()
        .then((sofa) => {
            return res.status(200).json({
                sofa,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};


const create = async (req: Request, res: Response, next: NextFunction) => {
    const { imageUrl, type, seats, length, width, depth } = req.body;

    const _sofa = new Sofa({
        _id: new mongoose.Types.ObjectId(),
        imageUrl,
        type,
        seats,
        length,
        width,
        depth
    });

    try {
        const sofa = await _sofa
            .save();
        return res.status(201).json({
            sofa
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error
        });
    }
};

const deleteSofa = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    console.log(_id)

    Sofa.findOneAndDelete({ _id: _id })
        .exec()
        .then((sofa) => {
            return res.status(200).json({
                sofa: sofa,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getAllSofas = (req: Request, res: Response, next: NextFunction) => {

    Sofa.find()
        .exec()
        .then((sofas) => {
            return res.status(200).json({
                sofas,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};


const getLastSofa = (req: Request, res: Response, next: NextFunction) => {

    Sofa.findOne()
        .sort({ updated_at: -1 })
        .exec()
        .then((sofa) => {
            return res.status(200).json({
                sofa,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const reportSofa = (req: Request, res: Response, next: NextFunction) => {
    const { report, _id, email } = req.body

    const posUpdate = { posrates: [email] }
    const negUpdate = { negrates: [email] }

    console.log(_id)

    if (report === 'Aprovado') {
        Sofa.findOneAndUpdate({ _id: _id }, posUpdate, { new: true })
            .exec()
            .then((sofa) => {
                return res.status(200).json({
                    sofa: sofa,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    }
    else {
        Sofa.findOneAndUpdate({ _id: _id }, negUpdate, { new: true })
            .exec()
            .then((sofa) => {
                return res.status(200).json({
                    sofa: sofa,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    }

};

export default { create, update, getAllSofas, deleteSofa, reportSofa, getLastSofa };