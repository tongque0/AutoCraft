import { prisma } from "../init.js";

export async function FindManyUser(){
    const result = await prisma.user.findMany();
    return result
}


