/* 

Callbacks that the Node can use to interact with external dependencies
but without having to interact with them directly

This is done through Dependency Injection

Find out more here: https://en.wikipedia.org/wiki/Dependency_injection

*/

import { IMessage } from "@zenvia/sdk";
import { AbstractContent } from "@zenvia/sdk/dist/lib/contents/abstract-content";
import WhatsappButtons from "../../types/whatsapp-buttons";
import WhatsappList from "../../types/whatsapp-list";

type MessageCallback = (...contents: AbstractContent[]) => Promise<IMessage>;
type ButtonsCallback = (buttons: WhatsappButtons) => Promise<void>;
type ListCallback = (list: WhatsappList) => Promise<void>;
type ChangeNodeCallback = (nodeID: string) => void;
type SetGlobalsCallback = (...pairs: Record<string, any>[]) => void;
type GetGlobalsCallback = (...keys: string[]) => Promise<Object>;
type emitEventCallback = (eventName: string, eventDetails: Object) => void;

export interface CallbackBundle {
    messageCallback: MessageCallback;
    buttonsCallback: ButtonsCallback;
    listCallback: ListCallback;
    changeNodeCallback: ChangeNodeCallback;
    setGlobalsCallback: SetGlobalsCallback;
    getGlobalsCallback: GetGlobalsCallback;
    emitEventCallback: emitEventCallback;
}
