import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/dbConfig/dbconfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

ConnectDB();

// PUT: Vendor submits verification or Admin approves/rejects
export async function PUT(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const currentUser = await User.findById(userId);
        if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const reqBody = await request.json();
        const { action, targetUserId, companyDetails } = reqBody;

        // USER SUBMISSION LOGIC (Vendor or Buyer)
        if (action === "submit_verification") {
            const allowedRoles = ['vendor', 'buyer'];
            if (!allowedRoles.includes(currentUser.role)) return NextResponse.json({ error: "Invalid role for verification" }, { status: 403 });

            currentUser.verificationStatus = 'pending_approval';
            // Optionally update company details if provided during submission
            if (companyDetails) {
                currentUser.companyDetails = { ...currentUser.companyDetails, ...companyDetails };
            }
            await currentUser.save();
            return NextResponse.json({ message: "Verification submitted successfully", success: true });
        }

        // ADMIN APPROVAL LOGIC
        if (action === "approve" || action === "reject") {
            if (currentUser.role !== 'admin') return NextResponse.json({ error: "Only admins can perform this action" }, { status: 403 });

            const targetUser = await User.findById(targetUserId);
            if (!targetUser) return NextResponse.json({ error: "Target user not found" }, { status: 404 });

            if (action === "approve") {
                targetUser.verificationStatus = 'approved';
                targetUser.isApproved = true;
            } else {
                targetUser.verificationStatus = 'rejected';
                targetUser.isApproved = false;
            }

            await targetUser.save();
            return NextResponse.json({ message: `User ${action}d successfully`, success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
