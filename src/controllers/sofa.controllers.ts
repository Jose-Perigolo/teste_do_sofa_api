import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Sofa from '../models/sofa.model';
import Grid from "gridfs-stream";

interface UploadRequest extends Request {
    sofa: {
        _id: string;
    }
}

const update = async (req: UploadRequest, res: Response, next: NextFunction) => {
    const { imageUrl, type, seats, length, width, depth, _id } = req.body;

    const update = { imageUrl, type, seats, length, width, depth }

    Sofa.findOneAndUpdate(_id, update, { new: true })
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

const updateSofa = (req: Request, res: Response, next: NextFunction) => {

};

// const getSofa = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const file = await gfs.files.findOne({ filename: req.params.filename });
//         const readStream = gridfsBucket.openDownloadStreamByName(file.filename);
//         readStream.pipe(res);
//     } catch (error) {
//         console.log(error);
//         res.send("Image not found");
//     }
// };

// const deleteSofa = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await gfs.files.deleteOne({ filename: req.params.filename });
//         res.send("success");
//     } catch (error) {
//         console.log(error);
//         res.send("An error occured.");
//     }
// };

const getSofa = async (req: Request, res: Response, next: NextFunction) => {

};

const deleteSofa = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    console.log(_id)

    Sofa.findOneAndDelete({ _id })
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
    const negUpdate = { posrates: [email] }

    console.log(update)

    if (report === 'Aprovado') {
        Sofa.findOneAndUpdate(_id, posUpdate, { new: true })
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
        Sofa.findOneAndUpdate(_id, negUpdate, { new: true })
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

export default { create, update, getSofa, getAllSofas, deleteSofa, reportSofa, getLastSofa };