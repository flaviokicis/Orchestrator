import AbstractNode from "../core/cortex/abstract-node";
import { UserInput } from "../core/cortex/input-types";

export default class MenuDetalhesNode extends AbstractNode {
    public getID(): string {
        return "node_MbeHWV8xThG0VjF";
    }

    public async run(input: UserInput): Promise<void> {
        // this.sendButtons(
        //     "Você pode ver algumas coisas sobre a sua música:",
        //     ["Ver letra", "Ouvir um pedacinho", "Tentar outra música"],
        // );
        this.sendList(
            "Você pode ver algumas coisas sobre a sua música :",
            "Clique aqui",
            "Resultado",
            "O que você quer fazer?",
            {
                title: "Ver letra",
                description: "Posso mandar a letra inteira pra você",
            },
            {
                title: "Ouvir um pedacinho",
                description: "Posso mandar um trecho da música pra você",
            },
            {
                title: "Tentar outra música",
                description: "Podemos tentar de novo",
            },
            {
                title: "Playlist no Spotify",
                description: "Topa colocar essa musica no spotify?",
            },
            {
                title: "Por enquanto é só",
                description: "",
            },
        );
        // Awaits for user input
        this.setNextInteractionNode(22);
    }
}
