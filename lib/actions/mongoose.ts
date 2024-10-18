import mongoose from "mongoose";

let isConnected: boolean = false;

const connectToDatabase = async () => {
  if (!process.env.MONGODB_URL) {
    console.error("MISSING MONGODB_URL");
    throw new Error("Missing MongoDB connection URL in environment variables");
  }

  // Check mongoose connection state (0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting)
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "NextJS",
      // Add any other connection options here
    });

    console.log("MongoDB is connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    throw error; // Propagate error to be able to handle it outside this function
  }
};

export default connectToDatabase;
