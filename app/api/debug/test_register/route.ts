import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

ConnectDB();

export async function GET(request: NextRequest) {
    try {
        const email = "test_user_" + Date.now() + "@test.com";
        const password = "password123";
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username: "TestUser_" + Date.now(),
            email,
            password: hashedPassword,
            role: "buyer", // Testing buyer role
            companyDetails: {
                name: "Test Co",
                address: "123 Test St",
                contact: "1234567890"
            },
            isApproved: false, // Explicitly mimicking the register route logic
            verificationStatus: 'pending_submission'
        });

        const savedUser = await newUser.save();

        return NextResponse.json({
            message: "Test user created",
            savedUser: {
                username: savedUser.username,
                role: savedUser.role,
                isApproved: savedUser.isApproved,
                verificationStatus: savedUser.verificationStatus
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
