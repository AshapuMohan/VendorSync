import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
import Bid from "@/models/bidModel";
import Tender from "@/models/tenderModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

ConnectDB();

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const reqBody = await request.json();
        const { status } = reqBody; // accepted, rejected

        const bid = await Bid.findById(id).populate('tender');
        if (!bid) {
            return NextResponse.json({ error: "Bid not found" }, { status: 404 });
        }

        // Only the creator of the tender can accept/reject
        // bid.tender is populated, but might be just ID if populate failed? No, mongoose populate returns doc.
        // But TS might complain if I don't cast or check.
        // Let's rely on basic ID check.
        // Wait, I need to fetch tender separately to be sure of type, or cast.
        // bid.tender object might not have createdBy if not populated deeper.

        const tender = await Tender.findById(bid.tender._id);
        if (!tender) {
            return NextResponse.json({ error: "Associated tender not found" }, { status: 404 });
        }

        if (tender.createdBy.toString() !== userId) {
            return NextResponse.json({ error: "Not authorized to manage bids for this tender" }, { status: 403 });
        }

        bid.status = status;
        await bid.save();

        return NextResponse.json({
            message: "Bid status updated",
            success: true,
            data: bid
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
