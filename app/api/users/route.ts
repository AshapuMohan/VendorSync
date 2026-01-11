import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

ConnectDB();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: "Only admins can view users" }, { status: 403 });
        }

        const users = await User.find({}).select("-password");

        return NextResponse.json({
            message: "Users fetched successfully",
            success: true,
            data: users
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
