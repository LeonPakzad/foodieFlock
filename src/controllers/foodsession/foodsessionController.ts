import { PrismaClient } from '@prisma/client'
import { flock } from '../flockController';

const prisma = new PrismaClient()

export module foodsession {

    export const getFoodSessionById = async (_req: {id: number;}) =>
    {
        const foodsession = await prisma.foodsession.findFirst({
            where: {
                id: Number(_req.id)
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
        var foodsession = await createFoodSession(Number(flockId), name);

        var responseData = {
            message: "successfully added foodsession",
            foodsessionID: foodsession.id
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

    export const getFoodsessionTimes = async(foodsessionId: number) =>
    {
        return await prisma.foodtime.findMany({
            where: {
                fkFoodsessionId: Number(foodsessionId),
            },
        })
    }

    // MARK: edit Foodsession
    export const editFoodSessions = async(_req: any, res: {render: (arg0: string, arg1: any) => void}) =>
    {
        var foodsessionId = JSON.parse(decodeURIComponent(_req.params.id))
        var foodsession = await getFoodSessionById(foodsessionId);

        var foodsessionpoll = await getFoodSessionPollByFoodsessionId(foodsessionId.id);

        var foodsessionpollAnswers: any[] = [];
        if(foodsessionpoll != null)
        {
            foodsessionpollAnswers = await getFoodSessionPollAnswersByPollId(foodsessionpoll.id);
        }

        if(foodsession != null)
        {
            var foodsessiontimes = await getFoodsessionTimes(foodsessionId.id)
            if(foodsessiontimes.length < 1)
            {
                res.render("foodsession/edit", {
                    title: "foodsessions",
                    flockId: foodsession.fkFlockId,
                    foodsession: foodsession,
                    input: {
                        foodsessionAppointmentType: foodsession.foodsessionAppointmentType,
                        isIndividualTimeSwitchChecked: foodsession.isIndividualTimeSwitchChecked,
                        foodsessionDecisionType: foodsession.fkFoodsessionDecisionType,
                        rouletteRadius: foodsession.rouletteRadius,
                        swypeRadius: foodsession.swypeRadius,
                        isPollAnswersAnonymousChecked: foodsessionpoll?.isPollAnswersAnonymousChecked,
                        isPollMultipleAnswersChecked: foodsessionpoll?.isPollMultipleAnswersChecked,
    
                        pollAnswers: foodsessionpollAnswers,
                    }
                });
            }
            else
            {
                res.render("foodsession/edit", {
                    title: "foodsessions",
                    flockId: foodsession.fkFlockId,
                    foodsession: foodsession,
                    input: {
                        foodsessionAppointmentType: foodsession.foodsessionAppointmentType,
                        isIndividualTimeSwitchChecked: foodsession.isIndividualTimeSwitchChecked,
                        foodsessionDecisionType: foodsession.fkFoodsessionDecisionType,
                        rouletteRadius: foodsession.rouletteRadius,
                        swypeRadius: foodsession.swypeRadius,
                        isPollAnswersAnonymousChecked: foodsessionpoll?.isPollAnswersAnonymousChecked,
                        isPollMultipleAnswersChecked: foodsessionpoll?.isPollMultipleAnswersChecked,
    
                        pollAnswers: foodsessionpollAnswers,
    
                        singleSessionTime:      foodsessiontimes[0].foodtime,
                        collectiveSessionTime:  foodsessiontimes[8].foodtime,
    
                        isMondaySwitchChecked:      foodsessiontimes[1].isChecked,
                        isTuesdaySwitchChecked:     foodsessiontimes[2].isChecked,
                        isWednesdaySwitchChecked:   foodsessiontimes[3].isChecked,
                        isThursdaySwitchChecked:    foodsessiontimes[4].isChecked,
                        isFridaySwitchChecked:      foodsessiontimes[5].isChecked,
                        isSaturdaySwitchChecked:    foodsessiontimes[6].isChecked,
                        isSundaySwitchChecked:      foodsessiontimes[7].isChecked,
    
                        foodtimeMonday:    foodsessiontimes[1].foodtime,
                        foodtimeTuesday:   foodsessiontimes[2].foodtime,
                        foodtimeWednesday: foodsessiontimes[3].foodtime,
                        foodtimeThursday:  foodsessiontimes[4].foodtime,
                        foodtimeFriday:    foodsessiontimes[5].foodtime,
                        foodtimeSaturday:  foodsessiontimes[6].foodtime,
                        foodtimeSunday:    foodsessiontimes[7].foodtime,
                    },      
                })
            }
        }
    }

    // MARK: show Foodsession
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

            switch(foodsession.fkFoodsessionDecisionType)
            {
                case 1:

                    res.render("foodsession/viewDefault", {
                        title: "foodsessions",
                        foodsession: foodsession,
                        isFlockLeader: isFlockLeader,
                        foodsessionentrys: foodsessionentrys,
                        isUserInFoodSession: isUserInFoodSession,
                    });

                break;
                case 2:

                    res.render("foodsession/viewRoulette", {
                        title: "foodsessions",
                        foodsession: foodsession,
                        isFlockLeader: isFlockLeader,
                        foodsessionentrys: foodsessionentrys,
                        isUserInFoodSession: isUserInFoodSession,
                    });

                break;
                case 3:

                    var foodsessionpoll = await getFoodSessionPollByFoodsessionId(foodsessionId.id);
                    var foodsessionpollAnswers: any[] = [];
                    var foodsessionpollAnsweredByUser: any[] = [];
                    if(foodsessionpoll != null)
                    {
                        foodsessionpollAnswers = await getFoodSessionPollAnswersByPollId(foodsessionpoll.id);
                        foodsessionpollAnsweredByUser = await getUserPollVotes(foodsessionpoll?.id, _req.user.userId);

                        if(foodsessionpoll?.isPollAnswersAnonymousChecked)
                        {

                        }
                    }

                    res.render("foodsession/viewPoll", {
                        title: "foodsessions",
                        foodsession: foodsession,
                        isFlockLeader: isFlockLeader,
                        foodsessionentrys: foodsessionentrys,
                        isUserInFoodSession: isUserInFoodSession,
                        foodsessionpoll: foodsessionpoll,
                        foodsessionpollAnswers: foodsessionpollAnswers,
                        foodsessionpollAnsweredByUser: foodsessionpollAnsweredByUser,
                    });

                break;
                case 4:

                    res.render("foodsession/viewSwyping", {
                        title: "foodsessions",
                        foodsession: foodsession,
                        isFlockLeader: isFlockLeader,
                        foodsessionentrys: foodsessionentrys,
                        isUserInFoodSession: isUserInFoodSession,
                    }); 

                break;
                case 5:

                    res.render("foodsession/viewIndividual", {
                        title: "foodsessions",
                        foodsession: foodsession,
                        isFlockLeader: isFlockLeader,
                        foodsessionentrys: foodsessionentrys,
                        isUserInFoodSession: isUserInFoodSession,
                    });

                break;
            }
        }
        else
        {
            res.redirect("/flock-index");
        }
    }   


    // MARK: get Foodsession Poll By Id
    export const getFoodSessionPollById = async(foodsessionpollId: number|undefined) =>
    {
        if(foodsessionpollId != null)
        {
            return prisma.foodsessionpoll.findFirst({
                where: {
                    id: foodsessionpollId
                },
            })
        }
        else
        {
            return null
        }
    }

    export const getFoodSessionPollByFoodsessionId = async(foodsessionId: number|undefined) =>
    {
        if(foodsessionId != null)
        {
            return prisma.foodsessionpoll.findFirst({
                where: {
                    fkFoodSession: Number(foodsessionId)
                },
            })
        }
        else
        {
            return null
        }
    }

    export const getFoodSessionPollAnswersByPollId = async(foodsessionPollId: number ) =>
    {
        return prisma.foodsessionpollanswer.findMany({
            where: {
                fkFoodsessionPoll: foodsessionPollId
            },
        })
    }

    export const getUserPollVotes = async(foodsessionPollId: number, userId: number ) =>
    {
        return prisma.userpollvoting.findMany({
            where: {
                AND: [
                    {fkFoodsessionPollAnswer: foodsessionPollId},
                    {fkUser: userId}
                ]
            },
        })
    }

    export const joinFoodSession = async(_req: any, res: {redirect: (arg0: string) => void;}) =>
    {
        var foodsessionId = JSON.parse(decodeURIComponent(_req.params.id));
        var flockId: number|null = await getFlockIdByFoodSessionId(foodsessionId.id);

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

    export const leaveFoodSessionLink = async (_req: any, res: {redirect: (arg0: string) => void;}) =>
    {
        var foodsessionId = JSON.parse(decodeURIComponent(_req.params.id));
        var flockId: number|null = await getFlockIdByFoodSessionId(foodsessionId.id);
        var userId = _req.user.userId;
        
        await leaveFoodSession(foodsessionId.id, userId);

        res.redirect(
            "/flock-show/" + encodeURIComponent(JSON.stringify({id: flockId})) + "/foodsession-show/" + encodeURIComponent(JSON.stringify({id: foodsessionId.id}))
        );
    }

    export const leaveFoodSession = async(foodsessionId: number, userId: number) =>
    {
        try
        {
            await prisma.foodsessionentry.deleteMany({
                where: {
                    fkUserId: Number(userId),
                    fkFoodSessionId: Number(foodsessionId),
                }
            });
        }
        catch(error)
        {
            console.log(error);
        }
    }

    export const leaveAllFoodSessions = async(userId: number) =>
    {
        try
        {
            await prisma.foodsessionentry.deleteMany({
                where: {
                    fkUserId: Number(userId),
                }
            });
        }
        catch(error)
        {
            console.log(error);
        }
    }

    export const deleteFoodSession = async(_req: any, res: {redirect: (arg0: string) => void;}) =>
    {
        var foodsessionId = JSON.parse(decodeURIComponent(_req.params.id));
        var flockId = await getFlockIdByFoodSessionId(foodsessionId.id);

        var foodsessionpolls = await prisma.foodsessionpoll.findMany({
            where: {
                fkFoodSession: foodsessionId.id
            }
        })

        if(foodsessionpolls != null)
        {
            foodsessionpolls.forEach(async foodsessionpoll => {

                var foodsessionpollanswers = prisma.foodsessionpollanswer.findMany({
                    where: {
                        fkFoodsessionPoll: foodsessionpoll.id
                    }
                }) 

                await prisma.foodsessionpollanswer.deleteMany({
                    where: {
                        fkFoodsessionPoll: foodsessionpoll.id
                    }
                })

                // todo: delete user votings
                // prisma.userpollvoting.deleteMany({
                //     where: {
                //         fkFoodsessionPollAnswer: foodsessionpollanswers
                //     }
                // })
            });

            await prisma.foodsessionpoll.deleteMany({
                where: {
                    fkFoodSession: foodsessionId.id
                }
            })
        }

        await prisma.foodtime.deleteMany({
            where: {
                fkFoodsessionId: foodsessionId.id
            }
        })

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
            return 0;
        }
        else
        {
            return foodsessionDecisionType.id;
        }
    }

    /** MARK: update F-Session
     * Updates a food session with the provided data.
     *
     * @param {any} _req - the request object
     * @param {{ end: (responseData: any) => void; render: (arg0: string, arg1: any) => void; json: any; redirect: (arg0: string) => void; }} res - the response object with end, render, json, and redirect functions
     * @return {Promise<void>} Promise that resolves once the food session is updated
     */
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
            foodsessionID, foodsessionAppointmentType, isIndividualTimeSwitchChecked, foodsessionDecisionType,
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
                fkFoodsessionDecisionType: await getFoodsessionDecisionTypeByName(foodsessionDecisionType),

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

            // get all poll answers
            var foodsessionPollAnswers = await prisma.foodsessionpollanswer.findMany({
                where: {
                    fkFoodsessionPoll: foodsessionpoll.id
                }
            })

            // first delete user votings
            await prisma.userpollvoting.deleteMany({
                where: {
                    fkFoodsessionPollAnswer:{
                        in: foodsessionPollAnswers.map((answer) => answer.id),
                    }
                }
            })

            // delete all poll answers
            await prisma.foodsessionpollanswer.deleteMany({
                where: {
                    fkFoodsessionPoll: foodsessionpoll.id
                }
            })

            // create new poll answers            
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

    /** MARK: C or U f-Times
     * Create or update food session time based on the provided parameters.
     *
     * @param {number}  foodsessionId   - The ID of the food session.
     * @param {number}  weekday         - The day of the week.
     * @param {string}  foodtime        - The time of the food session in HH:MM format.
     * @param {boolean} isChecked       - Indicates if the food time is checked.
     */
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

    // MARK: Submit Poll
    export const submitPoll = async(
        req: any, 
        res: {end: (responseData: any) => void;},

    ) => 
    {
        var userId:number = Number(req.user.userId); 
        const foodsessionID = req.body.foodsessionID;
        const pollAnswersToSend = req.body.pollAnswersToSend.map((answer: string) => parseInt(answer));

        var foodsessionpoll = await prisma.foodsessionpoll.findFirst({
            where: {
                fkFoodSession: Number(foodsessionID)
            }
        });

        // delete all poll answers
        if(foodsessionpoll != null)
        {
            await removeUsersPollAnswers(userId, foodsessionpoll);
        }

        // create new poll answers
        await addPollAnwers(pollAnswersToSend, userId);
        
        var responseData = {
            message: "successfully updated foodsession",
        }

        res.end(JSON.stringify(responseData))
    };

    export const removeUsersPollAnswers = async(userId: number, foodsessionpoll: any) => {
        // get all poll answers
        var foodsessionPollAnswers = await prisma.foodsessionpollanswer.findMany({
            where: {
                fkFoodsessionPoll: foodsessionpoll.id
            }
        })

        // first delete user votings
        var userpollvotings = await prisma.userpollvoting.findMany({
            where: {
                fkFoodsessionPollAnswer:{
                    in: foodsessionPollAnswers.map((answer) => answer.id),
                },
                fkUser: Number(userId)
            }
        })

        // first delete existant poll votes
        if(userpollvotings.length > 0)
        {
            for(var i = 0; i < userpollvotings.length; i++)
            {
                removePollVoteCount(userpollvotings[i].fkFoodsessionPollAnswer)
            }

            await prisma.userpollvoting.deleteMany({
                where: {
                    fkFoodsessionPollAnswer:{
                        in: foodsessionPollAnswers.map((answer) => answer.id),
                    },
                    fkUser: Number(userId)
                }
            });
        }
    }

    export const addPollAnwers = async(pollAnswersToSend: number[], userId: number) => {
        for(var i = 0; i < pollAnswersToSend.length; i++)
        {
            try
            {
                const foodsessionPollAnswer = await prisma.foodsessionpollanswer.findFirst({
                    where: {
                        id: Number(pollAnswersToSend[i]),
                    }
                });
                
                if (!foodsessionPollAnswer) {
                    throw new Error(`foodsessionPollAnswer with id ${pollAnswersToSend[i]} not found`);
                }
                

                await prisma.userpollvoting.create({
                    data: {
                        fkFoodsessionPollAnswer: Number(pollAnswersToSend[i]),
                        fkUser: Number(userId),
                    }
                });
                addPollVoteCount(pollAnswersToSend[i]);
            }
            catch(error)
            {
                console.error('foodsession error:', error);
            }
        }
    }
    
    export const addPollVoteCount = async(id:number) => {
    
        await prisma.foodsessionpollanswer.updateMany({
            where: {
                id: Number(id)
            },
            data: {
                count: {
                    increment: 1
                }
            }
        });
    }
    
    export const removePollVoteCount = async(id: number) => {
        await prisma.foodsessionpollanswer.updateMany({
            where: {
                id: Number(id)
            },
            data: {
                count: {
                    decrement: 1
                }
            }
        });
    }
} 
