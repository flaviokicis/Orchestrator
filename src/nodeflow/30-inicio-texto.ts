import config from "../config";
import searchGenius from "../controllers/genius-controller";
import AbstractNode from "../core/cortex/abstract-node";
import { UserInput } from "../core/cortex/input-types";
import ApiError from "../errors/api-error";
import greetings from '../utils/dictionary/greetings';
import makeListFromGenius from "../utils/genius-helper";

export default class Greetings extends AbstractNode {
    public getID(): string {
        return "node_bNIGEIT8GnfElUK";
    }

    public async run(input: UserInput): Promise<void> {
        if (this.isGreeting(input.getMessage())) {
            await this.sendTextMessage(
                "Olá, sou o Bot *MeFalaAMúsica*",
                "Você pode pedir para que eu identifique diversas músicas de algumas formas diferentes, como *mandando áudio* de um pedaço da música, cantando ou falando e até *escrevendo* uma parte da letra da música!"
            );
        } else if (input.getMessage().length >= config.MINIMUM_SEARCH_LENGTH) {
            if (input.getMessage().length <= config.MAXIMUM_SEARCH_LENGTH) {
                const geniusSearch = (await searchGenius(input.getMessage())).response;
                await this.sendTextMessage(...makeListFromGenius(geniusSearch));
            } else {
                this.sendTextMessage(
                    "O texto que você mandou é muito grande!",
                    "Tente mandar uma parte menor da letra");
            }
        }

    }

    public isGreeting(message: string): boolean {
        for (const greet of greetings) {
            if (greet.toLowerCase() === message.toLowerCase().replace('!', '')) {
                return true;
            }
        }
        return false;
    }



}
