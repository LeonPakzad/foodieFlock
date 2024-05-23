import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export module flock {

    export const getFlockById = async (_req: {id: number;}) =>
    {
        const flock = await prisma.flock.findFirst({
            where: {
                id: _req.id
            },
        });

        return flock;
    }

    export const getFlocksByUserId = async (_req: {userId: number;}) =>
    {
        const flocks = await prisma.flock.findMany({
            where: {
                users: {
                    some: {
                        flockId: _req.userId,
                    },
                },
            },
        })

        return flocks;
    }

    export const showFlock = async() => 
    {
        
    }

    export const indexFlocks = async (_req: {user:{userId:any;}}, res: { render: (arg0: string, arg1: {}) => void; }) =>
    {
        var flocks = await getFlocksByUserId(_req.user.userId);

        res.render("flock/index",
            {
                title: "flocks",
                flocks: flocks
            }
        )
    }

    export const createFlock = async (_req: {user:{userId:any;}, params: any}) => 
    {
        const assignCategories = await prisma.flock.create({
            data: {
                name: _req.params.name ,
                users: {
                    create: [{
                        assignedAt: new Date(),
                        user: {
                            connect: {
                                id: _req.user.userId,
                            },
                        },
                    },],
                },
            },
        })

        return assignCategories;
    }

    export const deleteFlock = async () =>
    {
        
    }
}