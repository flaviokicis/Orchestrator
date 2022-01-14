import { getGeniusPage } from "../controllers/genius-controller";
import AbstractNode from "../core/cortex/abstract-node";
import { UserInput } from "../core/cortex/input-types";
import scavengeLyrics from "../utils/lyrics-scavenger";

export default class Hello extends AbstractNode {
    public getID(): string {
        return "node_4y9oHctvpAC1MEp";
    }

    public async run(input: UserInput, music): Promise<void> {
        await this.sendTextMessage(
            "Estou lembrando a letra dessa música, só um segundo... 🤔🤨🧐",
        );
        // Retrives page
        const page = await getGeniusPage(music.title, music.artist);
        if (!page) {
            throw new Error("Genius Page Not Found");
        }
        // Scrapes lyrics from Genius (since Genius does not provide lyrics through their API =\)
        const lyrics = await scavengeLyrics(page);

        if (!lyrics) {
            throw new Error("Lyrics not found");
        }

        // Shows lyrics
        await this.sendTextMessage("Lembrei!", lyrics);

        // Sends buttons again after two seconds
        await this.sendButtons("Mais alguma coisa?", [
            "Ouvir um pedacinho",
            "Tentar outra música",
            "Por enquanto é só",
        ]);
        // Go to Node 22, where it checks what the user wants to do again
        this.setNextInteractionNode(22);
    }
}
