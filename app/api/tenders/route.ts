import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
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
        if (!user || (user.role !== 'buyer' && user.role !== 'admin')) {
            return NextResponse.json({ error: "Only buyers/admins can create tenders" }, { status: 403 });
        }

        const reqBody = await request.json();
        const { title, description, budget, deadline, documents } = reqBody;

        if (!title || !description || !budget || !deadline) {
            return NextResponse.json({ error: "Please provide all required fields" }, { status: 400 });
        }

        // Create new tender with default status 'pending' (handled by model)
        const newTender = new Tender({
            title,
            description,
            budget,
            deadline,
            documents: [], // Handle uploads separately
            createdBy: user._id,
            status: 'pending' // Explicitly set pending for clarity
        });

        const savedTender = await newTender.save();

        return NextResponse.json({
            message: "Tender created successfully",
            success: true,
            savedTender
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.role === 'admin') {
            const tenders = await Tender.find().populate("createdBy", "username email");
            return NextResponse.json({ success: true, data: tenders });
        }

        // Vendors see only active tenders
        const tenders = await Tender.find({ status: 'active' }).populate("createdBy", "username email");
        return NextResponse.json({ success: true, data: tenders });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
