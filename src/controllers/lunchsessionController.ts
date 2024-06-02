import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export module Foodsession {


    export const getFoodSessionById = async (_req: {id: number;}) =>
    {
        const Foodsession = await prisma.foodsession.findFirst({
            where: {
                id: _req.id
            },
        });
        return Foodsession;
    }

    export const getFoodSessionsByFlockId = async (flockId: number) =>
    {
        const Foodsessions = await prisma.foodsession.findMany({
            where: {
                fkFlockId: flockId
            },
        })
    }

}