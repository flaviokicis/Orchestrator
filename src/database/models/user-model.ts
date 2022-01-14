import { AnyObject, model, Schema } from "mongoose";

export interface UserModel {

    userID: String;
    lastInteraction: Date;
    lastNode: String;
    globals: AnyObject;

}

const userSchema = new Schema(
    {
        userID: String,
        lastInteraction: { type: Date, default: Date.now() },
        lastNode: { type: String, default: 1 },
        globals: Object,
    },
    {
        timestamps: true,
    },
);

export default model<UserModel>("User", userSchema);
