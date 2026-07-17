import mongoose from "mongoose";
import { env } from "./env";

if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined.");
}

export const connectDatabase = async (): Promise<void> => {
    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error);

        process.exit(1);
    }
};

mongoose.connection.on("connected", () => {
    console.log("📦 MongoDB connection established");
});

mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
    console.error("❌ MongoDB error:", error);
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();

    console.log("📴 MongoDB connection closed");

    process.exit(0);
});