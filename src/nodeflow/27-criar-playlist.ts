import AbstractNode from "../core/cortex/abstract-node";
import { UserInput } from "../core/cortex/input-types";
import createPlaylistInSpotify from "../controllers/spotify-controller";


export default class CriarPlaylist extends AbstractNode {
  
    public getID(): string {
        return "node_46AhDs1bLRa0OZo";
    }

    public async run(input: UserInput, music): Promise<void> {
        this.sendTextMessage("Estou criando sua playlist..");

        // await createPlaylistInSpotify();
        // await this.sendTextMessage(messageBot);

        // Go to options node
        this.runNode(21, input, music);
    }

}

