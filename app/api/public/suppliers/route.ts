import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
import User from "@/models/userModel";

ConnectDB();

export async function GET(request: NextRequest) {
    try {
        // Fetch only vendors, select limited fields for public display
        const vendors = await User.find({ role: 'vendor', isApproved: true })
            .select("username companyDetails _id")
            .limit(6); // Limit to 6 for homepage

        return NextResponse.json({
            message: "Suppliers fetched successfully",
            success: true,
            data: vendors
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
