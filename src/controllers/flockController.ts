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

    export const createFlock = async (_req: {user:{userId:any;}, query: any}, res: {redirect: (arg0:string,) => void}) => 
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

        res.redirect("/flock-index");
    }

    // delete all user in flocks entrys and the correlating flock
    export const deleteFlock = async (_req: {params: any}, res: {redirect: (arg0:string,) => void}) =>
    {
        var flockId: {id:number} = JSON.parse(decodeURIComponent(_req.params.id))

        deleteFlockById(flockId.id);

        res.redirect("/flock-index");
    }

    export const deleteFlockById = async(flockId: number) =>
    {
        try
        {

            await prisma.usersInFlocks.deleteMany({
                where: {
                    flockId: flockId,
                },
            })
            
            await prisma.flock.delete({
                where: {
                    id: flockId,
                }
            })
        }
        catch(error)
        {

        }
    }

    export const leaveFlock = async (_req: {user:{userId:any;}, params: any}, res: {redirect: (arg0:string,) => void}) =>
    {
        var userId:number = Number(_req.user.userId); 
        var flockId: {id:number} = JSON.parse(decodeURIComponent(_req.params.id))

        // leave flock
        await prisma.usersInFlocks.deleteMany({
            where: {
                AND: [
                    {userId: userId},
                    {flockId: flockId.id},
                ]
            },
        })

        // check if others are still in the flock, if no delete flock
        var usersInFlock = await prisma.usersInFlocks.count({
            where: {
                flockId: flockId.id
            }
        });

        if(usersInFlock == null)
        {
            deleteFlockById(flockId.id);
        }

        res.redirect("/flock-index");
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