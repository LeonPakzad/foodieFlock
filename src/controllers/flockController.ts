import { PrismaClient } from '@prisma/client'
import { user } from './userController';
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

interface FlattenedObject {
    [key: string]: any;
}

function flattenArrayOfObjects(array: any[]): FlattenedObject[] {
    return array.map((object: any) => {
        return flattenObject(object);
    });
}

function flattenObject(object: any, parentId?: string): FlattenedObject {

    const flattenedObject: FlattenedObject = {};

    // Iterate over each key in the input object.
    Object.keys(object).forEach((key: string) => {

        // Check if the current key is "id" and if a parentId is provided. If so, construct a composite key.
        if (key === 'id' && parentId) 
        {
            flattenedObject[`${parentId}_${key}`] = object[key];
        }

        // If the current value is an object and not null, and it's not an instance of Date, recurse into it.
        else if (typeof object[key] === 'object' && object[key] !== null && !(object[key] instanceof Date)) 
        {
            const flattened = flattenObject(object[key], key);
            Object.assign(flattenedObject, flattened);
        }
        else 
        {
            flattenedObject[key] = object[key];
        }
    });

    return flattenedObject;
}

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
                usersinflocks: {
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

        var usersInFlock = await user.getUsersByFlockId(flockId.id)
        var usersInFlockArray  = usersInFlock.map(function(iteration){ return iteration.user}) 
        var flock = await getFlockById(flockId);
        
        res.render("flock/view", {
            title: "flock",
            flock: flock,
            usersInFlock: usersInFlockArray,
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
                usersinflocks: {
                    create: [{
                        assignedAt: new Date(),
                        user: {
                            connect: {
                                id: userId,
                            },
                        },
                    },],
                },
                salt: await bcrypt.genSalt(10)
            },
        })

        res.redirect("/flock-index");
    }

    export const addUserToFlock = async (userId: number, flockSalt: string) =>
    {
        var flock = await prisma.flock.findFirst({
            where: 
            {
                salt: flockSalt
            }
        })

        if(flock != null)
        {
            await prisma.usersinflocks.create({
                data: {
                    userId: userId,
                    flockId: flock.id
                }
            })
        }
        else
        {
            console.log("flock not found")
        }
    }

    export const addUserToFlockLink = async (_req: {user:{userId:any;}, params: any}, res: {redirect: (arg0:string,) => void}) =>
    {
        var flockSalt = _req.params;
        var userId = JSON.parse(decodeURIComponent(_req.user.userId))

        if(userId == null)
        {
            res.redirect("/auth");    
        }
        else
        {
            addUserToFlock(userId, flockSalt);
            res.redirect("/flock-index");
        }
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
            await prisma.usersinflocks.deleteMany({
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
        await prisma.usersinflocks.deleteMany({
            where: {
                AND: [
                    {userId: userId},
                    {flockId: flockId.id},
                ]
            },
        })

        // check if others are still in the flock, if no delete flock
        var usersInFlock = await prisma.usersinflocks.count({
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
        await prisma.usersinflocks.deleteMany({
            where:{
                userId: userId
            }
        })
    }
}