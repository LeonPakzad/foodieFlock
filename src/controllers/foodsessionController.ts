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
                fkFoodsessionDecisionType: 1,
                swypeRadius: 1,
                rouletteRadius: 1,
                isIndividualTimeSwitchChecked: false,
            }
        })
    }

    export const createFoodSessionLink = async (_req: any, res: { end(jsonResponse: any): unknown;})=> 
    {
        const{flockId, name} = _req.body
        await createFoodSession(Number(flockId), name);

        var responseData = {
            message: "successfully added foodsession",
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
                foodsessionDecisionType: foodsession.fkFoodsessionDecisionType,
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

    export const getFoodsessionDecisionTypeByName = async(decisionType: string) =>
    {
        var foodsessionDecisionType = await prisma.foodsessiondecisiontype.findFirst({
            where: {
                name: decisionType
            }
        });

        if(foodsessionDecisionType == null)
        {
            return 1;
        }
        else
        {
            return foodsessionDecisionType.id;
        }
    }

    export const updateFoodSession = async(
        _req: any, 
        res: {
            end: (responseData: any) => void;
            render: (arg0: string, arg1: any) => void;json: any;
            redirect: (arg0: string) => void;
        }
    ) =>
    {
        const { 
            foodsessionID, foodsessionAppointmentType, isIndividualTimeSwitchChecked, fooddecisionType,
            singleSessionTime, collectiveSessionTime, individualTimes,
            isMondaySwitchChecked, isTuesdaySwitchChecked, isWednesdaySwitchChecked, isThursdaySwitchChecked, isFridaySwitchChecked, isSaturdaySwitchChecked, isSundaySwitchChecked,
            rouletteRadius, swypeRadius,
            isPollAnswersAnonymousChecked, isPollMultipleAnswersChecked, pollAnswers
        } = _req.body;

        await prisma.foodsession.update({
            where: {
                id: Number(foodsessionID)
            },
            data: {
                foodsessionAppointmentType: foodsessionAppointmentType,
                isIndividualTimeSwitchChecked: isIndividualTimeSwitchChecked,
                fkFoodsessionDecisionType: await getFoodsessionDecisionTypeByName(fooddecisionType),

                rouletteRadius: Number(rouletteRadius),
                swypeRadius: Number(swypeRadius),
            }
        })
        
        await createOrUpdateFoodsessionTime(foodsessionID, 0, singleSessionTime,        false);
        await createOrUpdateFoodsessionTime(foodsessionID, 1, individualTimes[0],       isMondaySwitchChecked);
        await createOrUpdateFoodsessionTime(foodsessionID, 2, individualTimes[1],       isTuesdaySwitchChecked);
        await createOrUpdateFoodsessionTime(foodsessionID, 3, individualTimes[2],       isWednesdaySwitchChecked);
        await createOrUpdateFoodsessionTime(foodsessionID, 4, individualTimes[3],       isThursdaySwitchChecked);
        await createOrUpdateFoodsessionTime(foodsessionID, 5, individualTimes[4],       isFridaySwitchChecked);
        await createOrUpdateFoodsessionTime(foodsessionID, 6, individualTimes[5],       isSaturdaySwitchChecked);
        await createOrUpdateFoodsessionTime(foodsessionID, 7, individualTimes[6],       isSundaySwitchChecked);
        await createOrUpdateFoodsessionTime(foodsessionID, 8, collectiveSessionTime,    false);

        createorUpdateFoodsessionPoll(foodsessionID, isPollMultipleAnswersChecked, isPollAnswersAnonymousChecked, pollAnswers)

        var responseData = {
            message: "successfully updated foodsession",
        }

        res.end(JSON.stringify(responseData))
    }

    export const createorUpdateFoodsessionPoll = async(foodsessionId: number, isPollMultipleAnswersChecked: boolean, isPollAnswersAnonymousChecked: boolean, pollAnswers: string) =>
    {

        var foodsessionpoll = await prisma.foodsessionpoll.findFirst({
            where: {
                fkFoodSession: Number(foodsessionId)
            }
        });

        if(foodsessionpoll == null)
        {
            foodsessionpoll = await prisma.foodsessionpoll.create({
                data: {
                    fkFoodSession: Number(foodsessionId),
                    isPollMultipleAnswersChecked: Boolean(isPollMultipleAnswersChecked),
                    isPollAnswersAnonymousChecked: Boolean(isPollAnswersAnonymousChecked),
                }
            })

            for(var i = 0; i < pollAnswers.length; i++)
            {
                await prisma.foodsessionpollanswer.create({
                    data: {
                        fkFoodsessionPoll: foodsessionpoll.id,
                        name: pollAnswers[i],
                        count: 0,
                    }
                })
            }
        }
        else
        {
            console.log(foodsessionId);
            await prisma.foodsessionpoll.updateMany({
                where: {
                    fkFoodSession: Number(foodsessionId)
                },
                data: {
                    fkFoodSession: Number(foodsessionId),
                    isPollMultipleAnswersChecked: Boolean(isPollMultipleAnswersChecked),
                    isPollAnswersAnonymousChecked: Boolean(isPollAnswersAnonymousChecked),
                }
            })

            // delete all poll answers and create the new ones
            await prisma.foodsessionpollanswer.deleteMany({
                where: {
                    fkFoodsessionPoll: foodsessionpoll.id
                }
            })
            for(var i = 0; i < pollAnswers.length; i++)
            {
                await prisma.foodsessionpollanswer.create({
                    data: {
                        fkFoodsessionPoll: foodsessionpoll.id,
                        name: pollAnswers[i],
                        count: 0,
                    }
                })
            }
        }
    }

    export const createOrUpdateFoodsessionTime = async(foodsessionId: number, weekday: number, foodtime: string, isChecked: boolean ) => {
        
        if(!(foodtime === ""))
        {
            try 
            {
                if (foodtime.length !== 5 || foodtime[2] !== ':') 
                {
                    throw ('Invalid foodtime format. Please use HH:MM format.');
                }
            
                const hours = parseInt(foodtime.slice(0, 2));
                const minutes = parseInt(foodtime.slice(3));
            
                if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) 
                {
                    throw ('Invalid time values. Hours should be between 0 and 23, and minutes should be between 0 and 59.');
                }
            }
            catch(error)
            {
                console.error('foodsession error:', error);
            }
        }
        
        var foodtimeentry = await prisma.foodtime.findFirst({
            where: {
                AND: [
                    {fkFoodsessionId: Number(foodsessionId)},
                    {weekday: weekday},
                ]
            },
        });
    
        if(foodtimeentry == null) 
        {
            await prisma.foodtime.create({
                data: {
                    fkFoodsessionId: Number(foodsessionId),
                    weekday: weekday,
                    foodtime: foodtime,
                    isChecked: Boolean(isChecked),
                }
            })
        } 
        else 
        {
            await prisma.foodtime.updateMany({
                where: {
                    AND: [
                        {fkFoodsessionId: Number(foodsessionId)},
                        {weekday: weekday},
                    ]
                },
                data: {
                    foodtime: foodtime,
                    isChecked: Boolean(isChecked),
                },
            });
        }
    }
} 