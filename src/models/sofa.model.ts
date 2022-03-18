import mongoose, { Schema } from 'mongoose';
import ISofa from '../interfaces/sofa.interface';

const UserSchema: Schema = new Schema(
    {
        imageUrl: String,
        approved: Boolean,
        type: { type: String, required: true },
        seats: { type: String, required: true },
        length: { type: String, required: true },
        width: { type: String, required: true },
        depth: { type: String, required: true },
        posrates: [{
            type: String
        }],
        negrates: [{
            type: String
        }],
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ISofa>('Sofa', UserSchema);