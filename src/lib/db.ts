import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Vercel serverless SQLite writeable path workaround
if (process.env.VERCEL) {
    const dbPath = "/tmp/dev.db";
    const bundledDb = path.join(process.cwd(), "prisma", "dev.db");

  try {
        if (!fs.existsSync(dbPath)) {
                fs.mkdirSync(path.dirname(dbPath), { recursive: true });
                if (fs.existsSync(bundledDb)) {
                          fs.copyFileSync(bundledDb, dbPath);
                          console.log("Copied SQLite database to writeable /tmp path successfully");
                }
        }
  } catch (error) {
        console.error("Failed to copy SQLite database to /tmp:", error);
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
