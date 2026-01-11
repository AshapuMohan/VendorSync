import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
import Tender from "@/models/tenderModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

ConnectDB();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = getDataFromToken(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: "Only admins can update tender status" }, { status: 403 });
        }

        const reqBody = await request.json();
        const { status } = reqBody;

        if (!['active', 'rejected', 'closed'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const tender = await Tender.findByIdAndUpdate(
            params.id,
            { status },
            { new: true }
        );

        if (!tender) {
            return NextResponse.json({ error: "Tender not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Tender status updated",
            success: true,
            data: tender
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const tender = await Tender.findById(params.id).populate("createdBy", "username email");
        if (!tender) {
            return NextResponse.json({ error: "Tender not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: tender });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
