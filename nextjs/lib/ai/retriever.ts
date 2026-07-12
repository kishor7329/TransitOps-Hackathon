import { prisma } from "@/lib/prisma";

export async function retrieveContext(question: string) {

    const vehicles = await prisma.vehicle.findMany();

    return JSON.stringify(vehicles);
}