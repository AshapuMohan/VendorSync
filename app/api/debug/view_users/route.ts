import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
import User from "@/models/userModel";

ConnectDB();

export async function GET(request: NextRequest) {
    try {
        const users = await User.find({}).sort({ createdAt: -1 }).limit(3);
        return NextResponse.json({
            success: true,
            data: users
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
