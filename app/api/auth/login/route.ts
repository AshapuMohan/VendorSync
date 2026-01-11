import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await ConnectDB();
        const reqBody = await request.json();
        const { username, password } = reqBody;

        // Allow login with either username or email later, but focusing on username as per existing frontend
        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        if (!user.password) {
            return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
        }
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET || "nextjssecret", { expiresIn: "1d" });

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                isAdmin: user.isAdmin
            }
        });

        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
