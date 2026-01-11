import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

ConnectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password, role, companyName, companyAddress, companyContact } = reqBody;

        if (!username || !email || !password || !role) {
            return NextResponse.json({ error: "Please provide all required fields" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            companyDetails: {
                name: companyName,
                address: companyAddress,
                contact: companyContact
            },
            // Explicitly set these to avoid schema default issues
            isApproved: role === 'admin',
            verificationStatus: role === 'admin' ? 'approved' : 'pending_submission'
        });

        const savedUser = await newUser.save();

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
