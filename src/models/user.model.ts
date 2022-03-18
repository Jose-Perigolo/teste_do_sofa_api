
import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user.interface';

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);