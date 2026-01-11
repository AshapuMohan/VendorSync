import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './userModel';

export interface ITender extends Document {
    title: string;
    description: string;
    budget: string;
    deadline: Date;
    documents: string[];
    createdBy: IUser['_id'];
    status: 'active' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}

const tenderSchema: Schema<ITender> = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a tender title"],
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
    },
    budget: {
        type: String,
        required: [true, "Please provide a budget range"],
    },
    deadline: {
        type: Date,
        required: [true, "Please provide a deadline"],
    },
    documents: [String],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'pending', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

// HMR workaround: Delete model if it exists to generic new schema
if (process.env.NODE_ENV !== 'production') delete mongoose.models.tenders;

const Tender: Model<ITender> = mongoose.models.tenders || mongoose.model<ITender>("tenders", tenderSchema);

export default Tender;
