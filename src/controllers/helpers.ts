interface FlattenedObject {
    [key: string]: any;
}

function flattenArrayOfObjects(array: any[]): FlattenedObject[] {
    return array.map((object: any) => {
        return flattenObject(object);
    });
}

function flattenObject(object: any, parentId?: string): FlattenedObject {

    const flattenedObject: FlattenedObject = {};

    // Iterate over each key in the input object.
    Object.keys(object).forEach((key: string) => {

        // Check if the current key is "id" and if a parentId is provided. If so, construct a composite key.
        if (key === 'id' && parentId) 
        {
            flattenedObject[`${parentId}_${key}`] = object[key];
        }

        // If the current value is an object and not null, and it's not an instance of Date, recurse into it.
        else if (typeof object[key] === 'object' && object[key] !== null && !(object[key] instanceof Date)) 
        {
            const flattened = flattenObject(object[key], key);
            Object.assign(flattenedObject, flattened);
        }
        else 
        {
            flattenedObject[key] = object[key];
        }
    });

    return flattenedObject;
}