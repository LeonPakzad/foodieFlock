
import { flock } from './flockController';
import {foodsession} from './foodsessionController'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export module user {

    // MARK: getter
    export const getUserById = async (_req: { id: number; } ) => 
    {
        const user = await prisma.user.findFirst({
            where: {
                id: _req.id,
            },
        });

        return user;
    }

    export const getUserByName = async (_req: { name: string; } ) => 
        {
            const user = await prisma.user.findUnique({
                where: {
                    email: _req.name,
                },
            });
            return user;
        }

    export const getUserByMail = async (_req: { email: string; } ) => 
    {
        const user = await prisma.user.findUnique({
            where: {
                email: _req.email,
            },
        });
        return user;
    }

    export const getUsers = async () => 
    {
        const users = await prisma.user.findMany({});
        return users;
    }

    export const getUsersByFlockId = async(flockId: number) =>
    {
        const usersInFlocks = await prisma.usersinflocks.findMany({
            where: {
                fkFlockId: Number(flockId)
            },
            include: {
                user: true
            }
        });
        return usersInFlocks;
    }

    export const getFlocksByUserId = async(userId: number) =>
    {
        const usersInFlocks = await prisma.usersinflocks.findMany({
            where: {
                fkUserId: Number(userId)
            },
            include: {
                flock: true
            }
        });
        return usersInFlocks;
    }

    export const getFriends = async(userId: number) =>
    {
        var user = await prisma.user.findFirst({
            where: {
            id: userId,
            },
            include: {
            friends: true,
            },
        });
        if(user != null) return user.friends;
    }

    // ToDo: maybe add a accept / decline later
    export const addFriend = async(_req: {user: { userId: any; }, params:any }) =>
    {
        var friendId = JSON.parse(decodeURIComponent(_req.params.id)); 
        var userId = _req.user.userId;

        var user = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              friends: {
                connect: {
                  id: friendId.userId,
                },
              },
            },
            include: {
              friends: true,
            },
        });

        await prisma.user.update({
            where: {
              id: friendId.userId,
            },
            data: {
              friends: {
                connect: {
                  id: userId,
                },
              },
            },
            include: {
              friends: false,
              _count: false,
              friendsRelation: false,
            },
        });
        return user;
    }

    export const removeFriend = async (userId: any, friendId: number) =>
    {
        var user = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              friends: {
                disconnect: {
                  id: friendId,
                },
              },
            },
            include: {
              friends: true,
            },
        });

        await prisma.user.update({
            where: {
              id: friendId,
            },
            data: {
              friends: {
                disconnect: {
                  id: userId,
                },
              },
            },
            include: {
              friends: false,
              _count: false,
              friendsRelation: false,
            },
        });
        return user;
    }

    // MARK: setter
    export const createUser = async (_req: {name: string; email: string; password: string; salt: string, }) => 
    {
        const user = await prisma.user.findFirst({
            where: {
                email: _req.email,
            },
        });

        if(user != null)
        {
            return false;
        }
        else
        {
            await prisma.user.create({
                data: {
                    name: _req.name,
                    email: _req.email,
                    password: _req.password,
                    salt: _req.salt,
                }
            })
        }

        return user;
    }

    export const deleteUser = async (_req: {id:number}) => 
    {
        try 
        {
            // delete friend relations
            var friends = await getFriends(_req.id);
            if(friends != null)
            {
                friends.forEach(friend => {
                    removeFriend(_req.id, friend.id);
                });
            }

            // delete their poll votings
            await prisma.userpollvoting.deleteMany({
                where: {
                    fkUser: Number(_req.id)
                }
            })

            // delete their foodsessionentries
            foodsession.leaveAllFoodSessions(Number(_req.id));

            flock.leaveFlocks(_req.id);

            await prisma.user.delete({
                where: {id: _req.id}
            })
        }
        catch(error)
        {
            console.log(error)
        }
    }

    export const handleDeleteUser = async (_req: any, res: {redirect: (arg0:string,) => void}) =>
    {
        var deletedUserId = JSON.parse(decodeURIComponent(_req.params.id)); 

        if(_req.user.userId != deletedUserId.id)
        {
            // log out user from flocks
            await flock.leaveFlocks(deletedUserId.id);
            // delete user
            await deleteUser(deletedUserId)
        }
        else
        {
            console.log("admins cant delete themself to ensure that at least one admin persists");
        }

        res.redirect('/user-index');
    }

    // MARK: render
    export const userIndex = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
        var users = await getUsers();
        res.render("user/index",
            {
                title: "users",
                users: users,
                thisUser: _req.user.userId ?? null,
            }
        )
    }

    export const isFriendOfUser = async(userId: number, friendId: number) =>
    {
        var user = await prisma.user.findFirst({
            where: {
            id: userId,
            },
            include: {
            friends: true,
            },
        });

        if(user != null)
        {
            for(var i = 0; i < user.friends.length; i++)
            {
                if(user.friends[i].id == friendId)
                {
                    return true;    
                }
            }
        }
        else
        {
            return false;
        }
    }

    export const userProfile = async (_req: {user: { userId: any; }; }, res: { render: (arg0: string, arg1: {}) => void; }) => {
        var user = await getUserById({id: _req.user.userId});
        if(user != null)
        {   
            var isThisUser = user.id === _req.user.userId;
            var friends = await getFriends(user.id);
            
            res.render("user/profile", {
                title: "profile",
                user: user,
                isThisUser: isThisUser,
                isFriendOfUser: false,
                thisUser: _req.user.userId ?? null,
                friends: friends,
            } );
        }
    }

    export const userProfileByMail = async (_req:  any, res: { render: (arg0: string, arg1: {}) => void; }) => {
        
        var user = await getUserById(JSON.parse(decodeURIComponent(_req.params.id)));
        if(user != null)
        {   
            var isThisUser = user.id === _req.user.userId;
            var friends = await getFriends(user.id);
            res.render("user/profile", {
                title: "profile",
                user: user,
                isThisUser,
                isFriendOfUser: await isFriendOfUser(user.id, _req.user.userId),
                thisUser: _req.user.userId ?? null,
                friends: friends,
            } );
        }
    }
}
