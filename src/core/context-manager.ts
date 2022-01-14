import { IChannel, IMessage } from "@zenvia/sdk";
import { AbstractContent } from "@zenvia/sdk/dist/lib/contents/abstract-content";

import WhatsappButtons from "../types/whatsapp-buttons";
import sendButtons from "../integrations/zenvia/button-content";
import AbstractNode from "./cortex/abstract-node";
import { CallbackBundle } from "./cortex/callback-bundle";
import { UserInput } from "./cortex/input-types";
import {
    getGlobals,
    getUserInfo,
    setGlobals,
    setUserCurrentNode,
} from "../database/databaseControllers/user-controller";
import nodeEngine from "./node-engine";
import moment from "moment";
import NodeRuntimeError from "../errors/node-runtime-error";
import Logger from "../utils/default-logger";
import ApiError from "../errors/api-error";
import config from "../config";
import WhatsappList from "../types/whatsapp-list";
import sendList from "../integrations/zenvia/list-content";
import getIDOrAlias from "../utils/helper-functions";

class ContextManager {
    // Get data from mongo and execute node using NodeEngine

    public async handleRequest(
        userInput: UserInput,
        channel: IChannel,
    ): Promise<void> {

        const callbackBundle = this.createDependencyBundle(userInput, channel);

        const info = await getUserInfo(userInput.getUserID());

        const lastInteraction: Date = info.lastInteraction;

        // Gets which node to go to
        let currentNode: string = info.lastNode as string;

        // If it's been more than 15 seconds, restart interaction
        if (moment.now() - lastInteraction.getTime() > 1000 * 60 * config.RESET_TIME) {
            // Resets
            currentNode = getIDOrAlias(1);
        }

        // In case the node has been deleted, resets flow.
        if (!nodeEngine.isNodeSet(currentNode)) currentNode = getIDOrAlias(1);

        let node: AbstractNode = nodeEngine.getNodeFromRegistry(currentNode);

        node.setCallbackBundle(callbackBundle); // Sets context
        try {
            await node.run(userInput); // Runs node
        } catch (error) {
            if (error instanceof ApiError) {

                try {
                    // Handle Error Gracefully
                    await node.sendTextMessage(...(await this.handleApiError(userInput)));
                } catch (error) {
                    Logger.error("There was an error running Node " + currentNode + "." +
                        "\n" + error);
                }

            }
            else {
                Logger.error("There was an error running Node " + currentNode + "." +
                    "\n" + error);
            }
        }
    }

    // Functions that will be injected so the Node can have context to interact with the User
    private createDependencyBundle(
        userInput: UserInput,
        channel: IChannel,
    ): CallbackBundle {
        // Message Callback
        const messageCallback = async (...contents: AbstractContent[]): Promise<IMessage> => {
            try {
                const message = await channel.sendMessage(
                    userInput.getReceiverID(),
                    userInput.getUserID(),
                    ...contents
                );
                return message;
            } catch (error) {
                if (config.DEBUG)
                    Logger.error("Error while trying to send message to user " + userInput.getUserID());
                else
                    throw new NodeRuntimeError("Error on sending message to user " + userInput.getUserID())
            }
        };

        const buttonsCallback = async (buttons: WhatsappButtons) => {
            await sendButtons(
                userInput.getReceiverID(),
                userInput.getUserID(),
                buttons,
            );
        };

        const listCallback = async (list: WhatsappList) => {
            await sendList(
                userInput.getReceiverID(),
                userInput.getUserID(),
                list
            );
        };

        // Change Node Callback
        const changeNodeCallback = (nodeID: string) => {
            // Sets next node to specified ID
            setUserCurrentNode(userInput.getUserID(), nodeID);
        };

        // Set Global Callback
        const setGlobalsCallback = async (...pairs: Record<string, any>[]) => {
            return await setGlobals(userInput.getUserID(), ...pairs);
        };

        // Change Node Callback
        const getGlobalsCallback = async (...keys: string[]) => {
            return await getGlobals(userInput.getUserID(), ...keys);
        };

        // Change Node Callback
        const emitEventCallback = (eventName: string, eventDetails: Object) => {
            // EMIT EVENT
        };

        // Test Globals

        return {
            messageCallback,
            buttonsCallback,
            listCallback,
            changeNodeCallback,
            setGlobalsCallback,
            getGlobalsCallback,
            emitEventCallback,
        };
    }

    public async handleApiError(userInput: UserInput): Promise<string[]> {
        const globalCount = await getGlobals(userInput.getUserID(), "apiErrorCount");
        if (globalCount) {
            let errorCount: number = globalCount as number;
            if (errorCount == 0) {
                await setGlobals(userInput.getUserID(), { "apiErrorCount": errorCount + 1 })
                return ["Parece que houve um erro aqui 😕", "Vamos tentar de novo:"];
            }
            if (errorCount == 1) {
                await setGlobals(userInput.getUserID(), { "apiErrorCount": errorCount + 1 })
                return ["Desculpa, não estou conseguindo fazer essa ação 😞", "Vamos tentar a última vez..."];
            }
            await setGlobals(userInput.getUserID(), { "apiErrorCount": 0 })
            await setUserCurrentNode(userInput.getUserID(), getIDOrAlias(1));
            return ["Parece que estou passando por problemas no momento 🤕", "Tente novamente um pouco mais tarde"];
        } else {
            await setGlobals(userInput.getUserID(), { "apiErrorCount": 1 })
            return ["Parece que houve um erro aqui 😕", "Vamos tentar de novo:"];
        }
    }

}

export default new ContextManager();
