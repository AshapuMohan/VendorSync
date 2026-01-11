import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string; // Optional because might be google auth later, but required for now
    role: 'admin' | 'buyer' | 'vendor';
    isAdmin: boolean;
    companyDetails?: {
        name: string;
        address: string;
        contact: string;
    };
    isApproved: boolean; // For vendors
    verificationStatus: 'pending_submission' | 'pending_approval' | 'approved' | 'rejected';
    documents: string[]; // URLs/Paths to uploaded docs
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    role: {
        type: String,
        enum: ['admin', 'buyer', 'vendor'],
        default: 'buyer',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    companyDetails: {
        name: String,
        address: String,
        contact: String,
    },
    isApproved: {
        type: Boolean,
        default: function (this: IUser) {
            return this.role === 'admin';
        },
    },
    documents: [String],
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    verificationStatus: {
        type: String,
        enum: ['pending_submission', 'pending_approval', 'approved', 'rejected'],
        default: 'pending_submission',
    },
}, { timestamps: true });

// Check if model exists to prevent overwrite error in hot reload
if (process.env.NODE_ENV !== 'production') delete mongoose.models.users;

const User: Model<IUser> = mongoose.models.users || mongoose.model<IUser>("users", userSchema);

export default User;
