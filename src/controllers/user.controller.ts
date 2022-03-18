import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import logging from '../config/logs';
import User from '../models/user.model';
import signJWT from '../functions/signJWT';

const NAMESPACE = 'User';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized.');

    return res.status(200).json({
        message: 'Token(s) validated'
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    let { username, email, password } = req.body;

    console.log(username, email, password);

    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(401).json({
                message: hashError.message,
                error: hashError
            });
        }

        const _user = new User({
            _id: new mongoose.Types.ObjectId(),
            username,
            email,
            password: hash,
        });

        return _user
            .save()
            .then((user) => {
                return res.status(201).json({
                    user
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    console.log(username, email, password);

    User.find({ email })
        .exec()
        .then((users) => {
            if (users.length !== 1) {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }

            bcryptjs.compare(password, users[0].password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Password Mismatch'
                    });
                } else if (result) {
                    signJWT(users[0], (_error, token) => {
                        if (_error) {
                            return res.status(500).json({
                                message: _error.message,
                                error: _error
                            });
                        } else if (token) {
                            return res.status(200).json({
                                message: 'Auth successful',
                                token: token,
                                username: users[0].username,
                                email: users[0].email,
                                role: users[0].role
                            });
                        }
                    });
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('-password')
        .exec()
        .then((users) => {
            return res.status(200).json({
                users: users,
                count: users.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};


const update = (req: Request, res: Response, next: NextFunction) => {
    const { username, email, role, _id } = req.body

    const update = { username, email, role }

    User.findOneAndUpdate({ _id: _id }, update, { new: true })
        .select('-password')
        .exec()
        .then((users) => {
            return res.status(200).json({
                users: users,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params

    User.findOneAndDelete({ _id: _id })
        .select('-password')
        .exec()
        .then((users) => {
            return res.status(200).json({
                users: users,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { validateToken, register, login, getAllUsers, update, deleteUser };