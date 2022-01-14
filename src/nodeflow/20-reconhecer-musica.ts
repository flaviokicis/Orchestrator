import AbstractNode from "../core/cortex/abstract-node";
import { UserInput } from "../core/cortex/input-types";
import recognizeMusic from "../controllers/audd-controller";
import getAndEncode from "../utils/base64-download";
import config from "../config";

export default class ReconhecerMusica extends AbstractNode {
    public getID(): string {
        return "node_Sqy0PN6ELGOrwEJ";
    }

    public async run(input: UserInput): Promise<void> {
        // So the user can wait

        const audioFile: string = await getAndEncode(input.getFileUrl());
        if (audioFile.length < config.MINIMUM_AUDIO_FILE_SIZE) {
            this.sendTextMessage(
                "O áudio que você mandou é muito pequeno 🙁",
                "Por favor, grave um áudio de maior duração");
            this.setNextInteractionNode(20);
            return;
        }

        await this.sendTextMessage("Só um segundo, estou ouvindo seu áudio...");

        // Tries to recognize song from audio
        try {
            const music = await recognizeMusic(input.getFileUrl());

            if (music) {

                // Go to Node when music is found
                this.runNode(26, input, music);

            } else {

                // Music was not found in user's audio, so...
                // Try to convert speech to text and search lyrics :)
                this.runNode(25, input, audioFile);

            }
        } catch {
            this.sendTextMessage(
                "Não foi possível identificar a música do áudio, tente novamente",
            );
            this.setNextInteractionNode(1);
        }
    }
}
