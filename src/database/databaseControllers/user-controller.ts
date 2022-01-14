import DatabaseError from "../../errors/database-error";
import userSchema, { UserModel } from "../models/user-model";

let currentNode: number = 1;

// Get node they should go to
export async function getUserInfo(userID: string) {
    try {
        const result = await userSchema.findOne({ userID }, "lastNode lastInteraction");
        if (!result) {
            return await userSchema.create({ userID, lastNode: 1, lastInteraction: new Date() });
        }
        return result;
    } catch (error) {
        throw new DatabaseError("Error while trying to retrieve user information in MongoDB");
    }
}

// Next time user interacts, they're gonna go to this node...
export async function setUserCurrentNode(userID: string, nodeID: string) {

    try {
        await userSchema.updateOne({ userID },
            {
                "$set": { lastNode: nodeID, lastInteraction: new Date() }
            }
        );
    } catch (error) {
        throw new DatabaseError("Error while trying to set current node in MongoDB");
    }
}

export async function setGlobals(userID: string, ...pairs: Record<string, any>[]) {
    try {
        let globalsObject = {};
        for (const pair of pairs) {
            globalsObject["globals." + Object.keys(pair)[0]] = Object.values(pair)[0];
        }

        return await userSchema.findOneAndUpdate({ userID },
            {
                "$set": globalsObject
            });
    } catch (error) {
        throw new DatabaseError("Error while trying to Set Global in MongoDB");
    }
}

export async function getGlobals(userID: string, ...keys: string[]) {
    try {

        const result = (await userSchema.findOne({ userID }, "globals"));
        if (!keys) {
            return result.globals;
        }
        if (keys.length == 1) {
            return result.globals[keys[0]];
        }
        const returnObj = {};
        for (const key of keys) {
            returnObj[key] = result.globals[key];
        }
        return returnObj;

    } catch (error) {
        throw new DatabaseError("Error while trying to Get Global in MongoDB");
    }
}
