import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest): string | null => {
    try {
        const token = request.cookies.get("token")?.value || '';
        if (!token) return null;

        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET || "nextjssecret");
        return decodedToken.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
