
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export module user {

    // MARK: getter
    export const getUser = async (_req: { id: number; } ) => 
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

    export const deleteUser = async (_req: {id: number}) => 
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

    // MARK: render
    export const userIndex = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
        var users = await getUsers();
        res.render("user/index",
            {
                title: "user index",
                users: users,
            }
        )
    }

    export const userProfile = async (_req: {user: { userId: any; }; }, res: { render: (arg0: string, arg1: {}) => void; }) => {
        var user = await getUserByMail({email: _req.user.userId});
        if(user != null)
        {   
            res.render("user/profile", {
                title: "profile",
                user: user,
            } );
        }
    }

}
