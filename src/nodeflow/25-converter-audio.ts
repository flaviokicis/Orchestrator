import config from "../config";
import transcript from "../controllers/gcloud-controller";
import searchGenius from "../controllers/genius-controller";
import AbstractNode from "../core/cortex/abstract-node";
import { UserInput } from "../core/cortex/input-types";
import Logger from "../utils/default-logger";
import makeListFromGenius from "../utils/genius-helper";

export default class Hello extends AbstractNode {
    public getID(): string {
        return "node_nBiuBF3oCVNTFH3";
    }

    public async run(input: UserInput, audioEncoded): Promise<void> {
        const transcriptResult = await transcript(audioEncoded);
        if (!transcriptResult) {
            this.sendTextMessage(
                "Desculpa, não consegui entender!",
                "Tente mais uma vez, por favor",
            );
            this.setNextInteractionNode(20);
        } else {
            if (config.DEBUG)
                Logger.info(
                    "Google Cloud understood this: " +
                    transcriptResult.join(" "),
                );

            const geniusSearch = (
                await searchGenius(transcriptResult.join(" "))
            ).response;

            if (geniusSearch.hits && geniusSearch.hits.length !== 0) {
                await this.sendTextMessage(
                    "Aqui está uma lista de músicas possivelmente relacionadas",
                    makeListFromGenius(geniusSearch),
                );
            } else {
                await this.sendTextMessage(
                    "Não foi possível identificar a música do áudio, tente novamente",
                );
                this.setNextInteractionNode(1);
            }
        }
    }
}
