import { PrismaClient } from '@prisma/client'
import { user } from './userController';

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

    export const getFlocksByUserId = async (userId: number) =>
    {
        const flocks = await prisma.flock.findMany({
            where: {
                users: {
                    some: {
                        userId: userId,
                    },
                },
            },
        })

        return flocks;
    }

    export const showFlock = async(_req: any, res: { render: (arg0: string, arg1: {})=> void;}) => 
    {
        var flockId = JSON.parse(decodeURIComponent(_req.params.id))

        var flock = await getFlockById(flockId);
        res.render("flock/view", {
            title: "flock",
            flock: flock,
        });
    }

    export const indexFlocks = async (_req: {user:{userId:any;}}, res: { render: (arg0: string, arg1: {}) => void; }) =>
    {
        var flocks = await getFlocksByUserId(_req.user.userId);

        res.render("flock/index", {
            title: "flocks",
            flocks: flocks
        })
    }

    export const createFlock = async (_req: {user:{userId:any;}, query: any}) => 
    {
        var userId:number = Number(_req.user.userId); 
        const assignCategories = await prisma.flock.create({
            data: {
                name: _req.query.name,
                users: {
                    create: [{
                        assignedAt: new Date(),
                        user: {
                            connect: {
                                id: userId,
                            },
                        },
                    },],
                },
            },
        })

        return assignCategories;
    }

    // delete all user in flocks entrys and the correlating flock
    export const deleteFlock = async () =>
    {
        
    }

    // only delete the user in the flock entry
    export const leaveFlock = async (userId: number, flockId: number) =>
    {
        await prisma.usersInFlocks.deleteMany({
            where: {
                AND: [
                    {userId: userId},
                    {flockId: flockId},
                ]
            },
        })

    }

    // delete all flock entries with the given user
    export const leaveFlocks = async (userId: number) =>
    {
        await prisma.usersInFlocks.deleteMany({
            where:{
                userId: userId
            }
        })

    }
}