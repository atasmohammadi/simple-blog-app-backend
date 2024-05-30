import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

async function connectToDb() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1); // Exit on connection failure
  }
}

export const db = client.db("your_database_name"); // Access the entire database

(async () => {
  await connectToDb();
})(); // Connect to DB on app startup
