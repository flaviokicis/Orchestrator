import AbstractNode from "../core/cortex/abstract-node";
import { UserInput } from "../core/cortex/input-types";

export default class ChecarPreview extends AbstractNode {
    public getID(): string {
        return "node_LxmFllSS-omQ4VP";
    }

    public async run(input: UserInput, music): Promise<void> {
        if (music.spotify?.preview) {
            await this.sendTextMessage("Uma palhinha da música 😄");
            await this.sendAudioMessage(music.spotify.preview, "audio/mpeg");
        } else if (music.apple_music?.preview) {
            await this.sendTextMessage("Uma palhinha da música 😄");
            await this.sendAudioMessage(music.apple_music.preview, "audio/aac");
        } else {
            await this.sendTextMessage(
                "Puts 🥶",
                "Vou ficar te devendo o pedacinho, infelizmente não tenho 😔",
                "Fique a vontade para enviar outro audio")
        }
        // Sends buttons again after two seconds
        setTimeout(() => this.sendButtons("Mais alguma coisa?",
            ["Ver letra", "Tentar outra música", "Por enquanto é só"]), 2000);
        // Awaits for user input
        this.setNextInteractionNode(22);
    }
}
