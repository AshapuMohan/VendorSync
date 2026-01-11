import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import ConnectDB from "@/dbConfig/dbconfig";

ConnectDB();

export async function POST(req: NextRequest) {
    try {
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replaceAll(" ", "_");
        const uniqueName = `${uuidv4()}_${filename}`;

        // Ensure public/uploads exists
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, uniqueName);
        fs.writeFileSync(filePath, buffer);

        const publicUrl = `/uploads/${uniqueName}`;

        // Update user documents list
        const user = await User.findById(userId);
        if (user) {
            user.documents.push(publicUrl);
            await user.save();
        }

        return NextResponse.json({
            message: "File uploaded successfully",
            success: true,
            url: publicUrl
        });

    } catch (error: any) {
        console.log("Error occurred ", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
