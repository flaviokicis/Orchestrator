import { IMessage, IMessageBatch } from "@zenvia/sdk";
import ApiError from "../../errors/api-error";
import { createButtons, createList } from "../../factories/whatsapp-content-factory";
import createFile from "../../factories/file-content-factory";
import createText from "../../factories/text-content-factory";
import Logger from "../../utils/default-logger";
import contextManager from "../context-manager";
import nodeEngine from "../node-engine";
import NodeEngine from "../node-engine";
import { CallbackBundle } from "./callback-bundle";
import { UserInput } from "./input-types";
import isNumeric from "../../utils/helper-functions";
import getIDOrAlias from "../../utils/helper-functions";

export default abstract class AbstractNode {
    private callbackBundle: CallbackBundle;

    public constructor() {
        if (this.getID()) NodeEngine.addNodeToRegistry(this.getID(), this);
    }

    /**
     UUID of Node
    */
    public abstract getID(): string;

    /**
     * This function will execute the actual code inside the Node
     * @param input - Input provided by user
     */
    public abstract run(input: UserInput, extra?: any): Promise<void> | void;

    /**
     * This function will tell context manager which flow it should go to next
     * @param {number} id - ID to which the flow will jump next
     */
    public async setNextInteractionNode(id: number | string): Promise<void> {
        if (NodeEngine.isNodeSet(id as string))
            this.callbackBundle.changeNodeCallback(id as string);
        else
            Logger.error(
                "Node " +
                this.getID() +
                " is trying to go to non-existant Node " +
                id +
                "!",
            );
    }

    public async runNode(nodeID: string | number, userInput: UserInput, extra?: any): Promise<void> {
        let node: AbstractNode = nodeEngine.getNodeFromRegistry(getIDOrAlias(nodeID));

        node.setCallbackBundle(this.callbackBundle); // Sets context

        try {
            await node.run(userInput, extra); // Runs node
        } catch (error) {
            if (error instanceof ApiError) {
                this.sendTextMessage(...(await contextManager.handleApiError(userInput)));
            } else {
                Logger.error("Error while running Node " + this.getID(), error);
            }
        }
    }

    /**
     * Sends the user a message of text type
     * @param text - Message to be sent to the user
     */
    public async sendTextMessage(...text: string[]): Promise<IMessage> {
        return this.callbackBundle.messageCallback(...createText(...text));
    }

    /**
     * Sends the user a message of buttons type
     * @param text - Message to be sent to the user
     */
    public async sendButtons(
        message: string,
        buttons: string[],
        footer?: string,
    ): Promise<void> {
        return this.callbackBundle.buttonsCallback(
            createButtons(message, buttons, footer),
        );
    }

    /**
 * Sends the user a message of text type
 * @param text - Message to be sent to the user
 */
    public async sendList(
        message: string,
        button: string,
        header: string,
        sectionName: string,
        ...contents: { title: string, description: string }[]
    ): Promise<void> {
        return this.callbackBundle.listCallback(
            createList(message, button, header, sectionName, ...contents),
        );
    }


    /**
     * Sends the user a message of audio type
     * @param audioUrl - Audio's URL to be sent
     * @param type - Type of audio (e.g. audio/mpeg)
     */
    public async sendAudioMessage(
        audioUrl: string,
        type?: string,
    ): Promise<IMessage> {
        return this.callbackBundle.messageCallback(
            createFile(audioUrl, type ? type : "audio/mpeg"),
        );
    }

    /**
     * Sets a Global Variable under the current user ID
     * @param key - Key of global variable
     * @param value - Value of global variable
     */
    public async setGlobals(...pairs: Record<string, any>[]): Promise<void> {

        return this.callbackBundle.setGlobalsCallback(...pairs);
    }

    /**
     * Retrieves a variable's value according to its key
     * @param key - Key of global variable
     */
    public async getGlobals(...keys: string[]): Promise<any> {
        return await this.callbackBundle.getGlobalsCallback(...keys);
    }

    /**
     * Saves event for the purpose of information/data gathering
     * @param eventName - Name of the event
     * @param eventDetails - Details of the event
     */
    public async emitEvent(
        eventName: string,
        eventDetails: Object,
    ): Promise<void> {
        return this.callbackBundle.emitEventCallback(eventName, eventDetails);
    }

    /**
     * Injects dependency into Node
     * @param bundle - Callback bundle that the current Node will use
     */
    public setCallbackBundle(bundle: CallbackBundle): void {
        this.callbackBundle = bundle;
    }
}
