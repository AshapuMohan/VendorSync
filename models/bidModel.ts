import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './userModel';
import { ITender } from './tenderModel';

export interface IBid extends Document {
    amount: string;
    proposal: string;
    vendor: IUser['_id'];
    tender: ITender['_id'];
    status: 'pending' | 'accepted' | 'rejected';
    documents: string[];
    createdAt: Date;
    updatedAt: Date;
}

const bidSchema: Schema<IBid> = new mongoose.Schema({
    amount: {
        type: String,
        required: [true, "Please provide a bid amount"],
    },
    proposal: {
        type: String,
        required: [true, "Please provide a proposal description"],
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    tender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenders',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    documents: [String],
}, { timestamps: true });

const Bid: Model<IBid> = mongoose.models.bids || mongoose.model<IBid>("bids", bidSchema);

export default Bid;
