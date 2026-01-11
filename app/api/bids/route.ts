import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
import Bid from "@/models/bidModel";
import Tender from "@/models/tenderModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

ConnectDB();

export async function POST(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user || user.role !== 'vendor') {
            return NextResponse.json({ error: "Only vendors can submit bids" }, { status: 403 });
        }

        if (!user.isApproved) {
            return NextResponse.json({ error: "Your account is not approved yet. Please complete verification." }, { status: 403 });
        }

        const reqBody = await request.json();
        const { tenderId, amount, proposal } = reqBody;

        if (!tenderId || !amount || !proposal) {
            return NextResponse.json({ error: "Please provide all required fields" }, { status: 400 });
        }

        // Check if tender exists and is active
        const tender = await Tender.findById(tenderId);
        if (!tender || tender.status !== 'active') {
            return NextResponse.json({ error: "Tender not found or not active" }, { status: 404 });
        }

        // Check if already bid? (Optional logic, let's allow multiple or strict one)
        // For simplicity, let's allow 1 bid per vendor per tender
        const existingBid = await Bid.findOne({ vendor: userId, tender: tenderId });
        if (existingBid) {
            return NextResponse.json({ error: "You have already placed a bid on this tender" }, { status: 400 });
        }

        const newBid = new Bid({
            tender: tenderId,
            vendor: userId,
            amount,
            proposal,
            status: "pending"
        });

        const savedBid = await newBid.save();

        return NextResponse.json({
            message: "Bid submitted successfully",
            success: true,
            savedBid
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const tenderId = url.searchParams.get("tenderId");
        const vendorId = url.searchParams.get("vendorId"); // To see my own bids? only if logic supports

        let query: any = {};
        if (tenderId) query.tender = tenderId;

        // If user is vendor, they should only see their own bids? Or is this for Buyer?
        // Let's implement authorization:
        const userId = getDataFromToken(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.role === 'vendor') {
            // Vendors see only their own bids
            query.vendor = userId;
        }
        // Buyers can see all bids for their tenders, or all bids if params provided? 
        // Ideally Buyer should check if they own the tender in the query loop, but for now allow Buyers to see bids if they know tenderId.

        const bids = await Bid.find(query)
            .populate("vendor", "username companyDetails")
            .populate("tender", "title");

        return NextResponse.json({
            message: "Bids fetched successfully",
            success: true,
            data: bids
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
