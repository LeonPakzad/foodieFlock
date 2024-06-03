import { PrismaClient } from '@prisma/client'
import { flock } from './flockController';

const prisma = new PrismaClient()

export module foodsession {

    export const getFoodSessionById = async (_req: {id: number;}) =>
    {
        const foodsession = await prisma.foodsession.findFirst({
            where: {
                id: _req.id
            },
        });
        return foodsession;
    }

    export const getFoodSessionsByFlockId = async (flockId: number) =>
    {
        const foodsessions = await prisma.foodsession.findMany({
            where: {
                fkFlockId: Number(flockId),
            },
        })
        return foodsessions;
    }

    export const getUsersInFoodSessionById = async(foodSessionId: number) =>
    {
        return await prisma.usersinfoodsession.findMany({
            where: {
                fkFoodSessionId: Number(foodSessionId),
            },
        })
    }

    export const viewFoodSessionById = async (foodsessionId: number) => 
    {
        const foodsession = await prisma.foodsession.findFirst({
            where: {
                id: foodsessionId,
            },
        })
        return foodsession;
    }

    export const createFoodSession = async (flockId: number, name: string) => 
    {
        return await prisma.foodsession.create({
            data: {
                name: name,
                fkFlockId: flockId,
            },
        })
    }

    export const createFoodSessionLink = async (_req: any, res: {redirect: (arg0: string) => void;}) => 
    {
        const{flockId, name} = _req.body
        await createFoodSession(Number(flockId), name);
        res.redirect("/flock-index");
    }

    export const getFlockIdByFoodSessionId = async(foodsessionId: number) =>
    {
        return await prisma.foodsession.findFirst({
            where: {
                id: foodsessionId,
            },
        })
    }

    export const showFoodSession = async(_req: any, res: {render: (arg0: string, arg1: any) => void; redirect: (arg0: string) => void;}) =>
    {
        var foodsessionId = JSON.parse(decodeURIComponent(_req.params.id));
        var foodsession = await getFoodSessionById(foodsessionId);
        var usersinfoodsession = await getUsersInFoodSessionById(foodsessionId.id);
            
        if(foodsession != null)
        {
            var isFlockLeader: boolean = false;
            var flockLeaderId = await flock.getFlockLeaderByFlockId(foodsession!.fkFlockId);

            if(_req.user.userId == flockLeaderId?.fkUserId)
            {
                isFlockLeader = true;
            }

            var isUserInFoodSession = usersinfoodsession.some(({ fkUserId }) => fkUserId === _req.user.userId);

            res.render("foodsession/view", {
                title: "foodsession",
                flockId: foodsession.fkFlockId,
                foodsession: foodsession,
                isFlockLeader: isFlockLeader,
                usersinfoodsession: usersinfoodsession,
                isUserInFoodSession: isUserInFoodSession,
            });
        }
        else
        {
            res.redirect("/flock-index");
        }
    }   

    export const joinFoodSession = async(_req: any, res: {redirect: (arg0: string) => void;}) =>
    {
        var foodsessionId = JSON.parse(decodeURIComponent(_req.params.id));
        var flockId = await getFlockIdByFoodSessionId(foodsessionId);

        try
        {
            await prisma.usersinfoodsession.create({
                data: {
                    fkFoodSessionId: foodsessionId.id,
                    fkUserId: _req.user.userId
                }
            })
        }
        catch(error)
        {
            console.log(error);
        }
        
        res.redirect(   
            "/flock-show/" + encodeURIComponent(JSON.stringify({id: flockId}))) + 
            "/foodsession-show/" + encodeURIComponent(JSON.stringify({id: foodsessionId.id})
        );
    }
}