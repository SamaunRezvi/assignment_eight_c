import "server-only";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

// Reuse one client across hot reloads in development and across invocations in production.
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(uri, { maxPoolSize: 10 });
if (process.env.NODE_ENV !== "production") globalForMongo.mongoClient = mongoClient;

export const db = mongoClient.db(process.env.MONGODB_DB ?? "studiospace");
