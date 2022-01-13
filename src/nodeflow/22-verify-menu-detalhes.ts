import searchGenius from "../controllers/genius-controller";
import AbstractNode from "../core/cortex/abstract-node";
import { UserInput } from "../core/cortex/input-types";
import { SongDetails } from "../types/song";

export default class VerificarMenuDetalhes extends AbstractNode {
    public getID(): number {
        return 22;
    }

    public async run(input: UserInput, music): Promise<void> {
        // If there is no music provided, get from context
        if (!music) music = await this.getGlobals("lastSong");

        if (input.getMessage() === "Ver letra") {
            // Lyrics

            try {
                // Go to Lyrics Node
                this.runNode(23, input, music);
            } catch (error) {
                this.sendTextMessage(
                    "Puts, não lembrei da letra dessa música 😣",
                    "Poderia tentar de novo mais tarde?",
                );
            }
        } else if (input.getMessage() === "Ouvir um pedacinho") {
            // Go to preview node
            this.runNode(24, input, music);
        } else if (input.getMessage() === "Tentar outra música") {
            this.sendTextMessage(
                "Ok, vamos tentar novamente",
                "Envie um áudio com a música que deseja descobrir",
            );
            this.setNextInteractionNode(1);
        } else if (input.getMessage() === "Playlist no Spotify") {
            this.runNode(27, input, music);
        } else if (input.getMessage() === "Por enquanto é só") {
            this.sendTextMessage(
                "Muito obrigado!",
                "Me pergunte sempre que precisar 😁",
            );
            this.setNextInteractionNode(1);
        } else {
            await this.sendTextMessage(
                "Não entendi o que você quis dizer :/",
                "Vamos tentar de novo",
            );
            this.runNode(21, input);
        }
    }
}
