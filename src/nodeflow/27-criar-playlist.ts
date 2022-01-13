import AbstractNode from "../core/cortex/abstract-node";
import { UserInput } from "../core/cortex/input-types";
import createPlaylistInSpotify from "../controllers/spotify-controller";

export default class Hello extends AbstractNode {
    public getID(): number {
        return 27;
    }

    public async run(input: UserInput, music): Promise<void> {
        this.sendTextMessage("Estou criando sua playlist..");

        // await createPlaylistInSpotify();
        // await this.sendTextMessage(messageBot);

        // Go to options node
        this.runNode(21, input, music);
    }
}
