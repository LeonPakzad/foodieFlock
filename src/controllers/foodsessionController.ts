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
            include: {
                
            }
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

    export const getFoodSessionEntrysById = async(foodSessionId: number) =>
    {
        return await prisma.foodsessionentry.findMany({
            where: {
                fkFoodSessionId: Number(foodSessionId),
            },
        })
    }

    export const getUserViewsInFoodSessionById = async(foodSessionId:number) =>
    {
        return await prisma.foodsessionentry.findMany({
            where: {
                fkFoodSessionId: Number(foodSessionId),
            },
            include: {
                user: true
            }
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

    export const findFoodSessionViewsByUserID = async (userId: number) =>
    {
        return await prisma.foodsessionentry.findMany({
            where: {
                fkUserId: userId
            },
            include: {
                foodsession: true
            }
        })
    }

    export const indexFoodSessions = async (_req: any, res: {render: (arg0: string, arg1: {}) => void;}) => 
    {
        const foodsessions = await findFoodSessionViewsByUserID(_req.user.userId);
        res.render('foodsession/index', {
            title: 'foodsessions',
            foodsessions: foodsessions
        });
    }

    export const createFoodSession = async (flockId: number, name: string) => 
    {
        return await prisma.foodsession.create({
            data: {
                name: name,
                fkFlockId: flockId,
                fkFoodsessionType: "unset"
            }
        })
    }

    export const createFoodSessionLink = async (_req: any, res: { end(jsonResponse: any): unknown;})=> 
    {
        const{flockId, name} = _req.body
        await createFoodSession(Number(flockId), name);

        var responseData = {
            message: "successfully added Foodsession",
        }

        res.end(JSON.stringify(responseData))
    }

    export const getFlockIdByFoodSessionId = async(foodsessionId: number) =>
    {
        var foodsession = await prisma.foodsession.findFirst({
            where: {
                id: Number(foodsessionId),
            },
        })

        if(foodsession != null)
        {
            return foodsession.fkFlockId;
        }
        else 
        {
            return null;
        }
    }

    export const editFoodSessions = async(_req: any, res: {render: (arg0: string, arg1: any) => void}) =>
    {
        var foodsessionId = JSON.parse(decodeURIComponent(_req.params.id))
        var foodsession = await getFoodSessionById(foodsessionId);

        if(foodsession != null)
        {
            res.render("foodsession/edit", {
                title: "foodsessions",
                flockId: foodsession.fkFlockId,
                foodsession: foodsession,
                input: {
                    radius: _req.query.radius,
                },
            })
        }
    }

    export const showFoodSession = async(_req: any, res: {render: (arg0: string, arg1: any) => void; redirect: (arg0: string) => void;}) =>
    {
        var foodsessionId = JSON.parse(decodeURIComponent(_req.params.id));
        var foodsession = await getFoodSessionById(foodsessionId);
        var foodsessionentrys = await getUserViewsInFoodSessionById(foodsessionId.id);  

        if(foodsession != null)
        {
            var isFlockLeader: boolean = false;
            var flockLeaderId = await flock.getFlockLeaderByFlockId(foodsession!.fkFlockId);

            if(_req.user.userId == flockLeaderId?.fkUserId)
            {
                isFlockLeader = true;
            }
            var isUserInFoodSession = foodsessionentrys.some(({ fkUserId }) => fkUserId === _req.user.userId);

            res.render("foodsession/view", {
                title: "foodsessions",
                flockId: foodsession.fkFlockId,
                foodsession: foodsession,
                isFlockLeader: isFlockLeader,
                foodsessionentrys: foodsessionentrys,
                isUserInFoodSession: isUserInFoodSession,
                foodsessionType: foodsession.fkFoodsessionType,
                input: {
                    radius: _req.query.radius,
                },
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
        var flockId = await getFlockIdByFoodSessionId(foodsessionId.id);

        try
        {
            await prisma.foodsessionentry.create({
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
            "/flock-show/" + encodeURIComponent(JSON.stringify({id: flockId})) + "/foodsession-show/" + encodeURIComponent(JSON.stringify({id: foodsessionId.id}))
        );
    }

    export const leaveFoodSession = async (_req: any, res: {redirect: (arg0: string) => void;}) =>
    {
        var foodsessionId = JSON.parse(decodeURIComponent(_req.params.id));
        var flockId = await getFlockIdByFoodSessionId(foodsessionId.id);
        var userId = _req.user.userId;
        
        await prisma.foodsessionentry.deleteMany({
            where: {
                fkUserId: Number(userId),
                fkFoodSessionId: Number(foodsessionId.id),
            }
        });

        res.redirect(
            "/flock-show/" + encodeURIComponent(JSON.stringify({id: flockId})) + "/foodsession-show/" + encodeURIComponent(JSON.stringify({id: foodsessionId.id}))
        );
    }

    export const deleteFoodSession = async(_req: any, res: {redirect: (arg0: string) => void;}) =>
    {
        var foodsessionId = JSON.parse(decodeURIComponent(_req.params.id));
        var flockId = await getFlockIdByFoodSessionId(foodsessionId.id);

        await prisma.foodsessionentry.deleteMany({
            where: {
                fkFoodSessionId: foodsessionId.id
            }
        })

        await prisma.locationsinfoodsessionentrys.deleteMany({
            where: {
                fkFoodSessionId: foodsessionId.id
            }
        })

        await prisma.foodsession.delete({
            where: {
                id: foodsessionId.id
            }
        })
        
        if(flockId != null)
        {
            res.redirect("/flock-show/" + encodeURIComponent(JSON.stringify({id: flockId})));
        }
        else
        {
            res.redirect("/flock-index");
        }
    }
}