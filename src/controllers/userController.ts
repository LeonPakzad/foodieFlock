
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// MARK: getter
export const getUser = async (_req: { email: string; } ) => 
{
    const user = await prisma.user.findFirst({
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


const userIndex = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    var users = await getUsers();
    res.render("user/index",
        {
            title: "user index",
            users: users,
        }
    )
}


// MARK: profile
const userProfile = async (_req: { email: string; }, res: { render: (arg0: string, arg1: {}) => void; }) => {
    const user = await prisma.user.findFirst({
        where: {
            email: _req.email,
        },
    });

    res.render("user/profile", {
        title: "profile",
        user: user,
    } );
}

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

// MARK: function export
module.exports =  {
    userProfile,
    userIndex,
    getUser,
    getUsers,
    createUser,
};