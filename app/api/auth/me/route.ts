import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import ConnectDB from "@/dbConfig/dbconfig";

ConnectDB();

// Inline helper to avoid "helpers/getDataFromToekn" issue if it doesn't exist
const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || '';
        if (!token) return null;
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET || "nextjssecret");
        return decodedToken.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function GET(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);
        if (!userId) { // If no token
            return NextResponse.json({
                message: "Not authenticated",
                success: false,
            }, { status: 401 });
        }

        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false,
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "User found",
            data: user
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
