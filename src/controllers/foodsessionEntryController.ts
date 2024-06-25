export const getFoodPlaces = async(_req: any) =>
{

}

export const safeChosenFoodPlaces = async(_req:any) =>
{

}

export const swypeFoodPlaces = async(_req: any) =>
{

}

// takes multiple place lists and responds with list of places that were selected in all place lists
export const compareFoodPlaceLists = async(_req: {list: {placeList}}) =>
{
    var placeListArray = Array(_req.list);
    var samePlacesListArray= [];
    for(var i = 0; i < placeListArray.length; i++)
    {

    }
    return samePlacesListArray;
}
