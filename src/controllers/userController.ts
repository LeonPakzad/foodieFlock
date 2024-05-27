
import { flock } from './flockController';
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
                flockId: flockId
            },
            include: {
                user: true
            }
        });
        return usersInFlocks;
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

    export const userProfile = async (_req: {user: { userId: any; }; }, res: { render: (arg0: string, arg1: {}) => void; }) => {
        var user = await getUserById({id: _req.user.userId});
        if(user != null)
        {   
            res.render("user/profile", {
                title: "profile",
                user: user,
                thisUser: _req.user.userId ?? null,
            } );
        }
    }

    export const userProfileByMail = async (_req:  any, res: { render: (arg0: string, arg1: {}) => void; }) => {
        
        var user = await getUserById(JSON.parse(decodeURIComponent(_req.params.id)));
        
        if(user != null)
        {   
            res.render("user/profile", {
                title: "profile",
                user: user,
                thisUser: _req.user.userId ?? null,
            } );
        }
    }
}
