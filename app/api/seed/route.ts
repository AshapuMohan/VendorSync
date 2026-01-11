import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

ConnectDB();

export async function GET(request: NextRequest) {
    try {
        // Check if admin already exists
        const admin = await User.findOne({ role: "admin" });
        if (admin) {
            return NextResponse.json({ message: "Admin already exists", admin: { username: admin.username, email: admin.email, password: "existing_password_hidden" } });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash("admin123", salt);

        const newAdmin = new User({
            username: "admin",
            email: "admin@vendorsync.com",
            password: hashedPassword,
            role: "admin",
            isAdmin: true,
            companyDetails: {
                name: "VendorSync HQ",
                address: "Global",
                contact: "admin@vendorsync.com"
            }
        });

        await newAdmin.save();

        return NextResponse.json({
            message: "Admin created successfully",
            success: true,
            credentials: {
                username: "admin",
                password: "admin123",
                email: "admin@vendorsync.com"
            }
        });

    } catch (error: any) {
        console.error("SEED API ERROR:", error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
