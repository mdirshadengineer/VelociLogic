import { PrismaClient } from "@prisma/client";

/**
 * Returns a singleton PrismaClient instance.
 * Ensures a single instance in development to avoid exhausting database connections.
 */
const prismaClientSingleton = () => new PrismaClient();

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// In development, attach Prisma client to global to prevent hot-reload instantiation
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
