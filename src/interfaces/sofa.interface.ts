import { Document } from 'mongoose';

export default interface ISofa extends Document {
    id: string;
    imageUrl?: string;
    approved?: boolean;
    type: string;
    seats: number;
    length: number;
    width: number;
    depth: number;
    posrates: String[];
    negrates: String[];
}