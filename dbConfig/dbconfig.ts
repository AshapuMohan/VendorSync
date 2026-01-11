import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

export default async function ConnectDB() {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("MONGO_URI env variable is NOT defined!");
            throw new Error("MONGO_URI is missing");
        }

        const db = await mongoose.connect(uri);

        connection.isConnected = db.connections[0].readyState;
        console.log("DB Connected Successfully");

    } catch (error) {
        console.log("Database connection failed", error);
        // process.exit(1); // Do not exit the process, let the request fail gracefully
        throw error;
    }
}