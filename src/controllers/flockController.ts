import { PrismaClient } from '@prisma/client'
import { user } from './userController';
import { foodsession } from './foodsessionController';

const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

export module flock {

    export const getFlockById = async (_req: {id: number;}) =>
    {
        const flock = await prisma.flock.findFirst({
            where: {
                id: Number(_req.id)
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
                        fkUserId: userId,
                    },
                },
            },
        })

        return flocks;
    }

    export const getFlockLeaderByFlockId = async (flockId:number) =>
    {
        return await prisma.usersinflocks.findFirst({
            where: {
                fkFlockId: Number(flockId),
                isFlockLeader: true,
            }
        });
    }

    export const showFlock = async(_req: any, res: { render: (arg0: string, arg1: {})=> void; redirect: (arg0:string,) => void}) => 
    {
        var flockId = JSON.parse(decodeURIComponent(_req.params.id))
        var flock = await getFlockById(flockId);

        if(flock != null)
        {
            var usersInFlock = await user.getUsersByFlockId(flockId.id)
            var friends = await user.getFriends(_req.user.userId)

            var usersInFlockArray = usersInFlock.map(function(iteration) {
                return iteration.user;
            });
            var friendArray = friends!.map(function(iteration) {
                return iteration;
            });
            var uninvitedFriends: { id: number; name: string; password: string; created: Date; updated: Date; email: string; salt: string; }[] | undefined = [];

            for(let i = 0; i < friendArray.length; i++)
            {
                // only add those friends who are not already in the flock
                if(!usersInFlockArray.some(({ id }) => id === friendArray[i].id))
                {
                    uninvitedFriends.push(friendArray[i])
                }
            }   

            var isFlockLeader: boolean = false;
            var flockLeaderId = await getFlockLeaderByFlockId(flockId.id);

            if(_req.user.userId == flockLeaderId?.fkUserId)
            {
                isFlockLeader = true;
            }

            var foodsessions = await foodsession.getFoodSessionsByFlockId(flockId.id);

            res.render("flock/view", {
                title: "flock",
                flock: flock,
                uninvitedFriends: uninvitedFriends,
                inviteLink: "http://" + _req.hostname +  ":3000" + "/flock-accept-invitation/" + encodeURIComponent(JSON.stringify({salt: flock.salt})),
                usersInFlock: usersInFlockArray,
                isFlockLeader: isFlockLeader,
                foodsessions: foodsessions
            });
        }
        else 
        {
            res.redirect("flock-index");
        }
    }

    export const indexFlocks = async (_req: {user:{userId:any;}}, res: { render: (arg0: string, arg1: {}) => void; }) =>
    {
        var flocks = await getFlocksByUserId(_req.user.userId);

        res.render("flock/index", {
            title: "flocks",
            flocks: flocks,
            userId: _req.user.userId,
        })
    }

    export const createFlock = async (_req: {user:{userId:any;}, query: any}, res: {redirect: (arg0:string,) => void}) => 
    {
        var userId:number = Number(_req.user.userId); 
        await prisma.flock.create({
            data: {
                name: _req.query.name,
                usersinflocks: {
                    create: [{
                        isFlockLeader: true,
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
        try
        {
            // check if the flock exists
            var flock = await prisma.flock.findFirst({
                where: 
                {
                    salt: flockSalt
                }
            })
            if(flock == null) throw new Error('flock doesnt exist');
            
            // check if user is already in the flock
            var userIsInFlock = await prisma.usersinflocks.count({
                where: 
                {
                    fkUserId: userId,
                    fkFlockId: flock.id
                }
            }) 
            if(userIsInFlock > 0) throw new Error('user already in flock');

            // add user to the flock
            await prisma.usersinflocks.create({
                data: {
                    fkUserId: userId,
                    fkFlockId: flock.id
                }
            })
        }
        catch(error)
        {
            console.log(error);
        }
    }

    export const addUserToFlockLink = async (_req: {user:{userId:any;}, params: any}, res: {redirect: (arg0:string,) => void}) =>
    {
        var flockSalt = JSON.parse(decodeURIComponent(_req.params.salt));
        var userId:number = Number(_req.user.userId); 

        if(userId == null)
        {
            res.redirect("/auth");    
        }
        else
        {
            await addUserToFlock(userId, flockSalt.salt);
            res.redirect("/flock-index");
        }
    }

    export const addFriendToFlock = async(_req: { body: { userId: number; flockSalt: string; };}, res: {redirect: (arg0:string,) => void}) =>
    {
        const { userId, flockSalt } = _req.body;
        await addUserToFlock(Number(userId), flockSalt);
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
            await prisma.usersinflocks.deleteMany({
                where: {
                    fkFlockId: flockId,
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
                    {fkUserId: userId},
                    {fkFlockId: flockId.id},
                ]
            },
        })

        // check if others are still in the flock, if no delete flock
        var usersInFlock = await prisma.usersinflocks.count({
            where: {
                fkFlockId: flockId.id
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
                fkUserId: userId
            }
        })
    }
}