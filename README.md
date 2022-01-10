
# NameThatSong/MeFalaAMúsica

Esse projeto é um Bot de WhatsApp que primariamente reconhece
a música tocada no áudio enviado pelo usuário, mas também pode
reconhecer a música que o usuário falou ou cantou e também pode procurar
músicas com a letra que o usuário enviou por texto.




## Tech Stack

NodeJS | TypeScript | Express | MongoDB


## Dependências

ZenviaSDK | AudD | GeniusAPI | Google Cloud Platform

Para rodar o Bot, é necessário criar uma conta nos serviços
mencionados e adquirir um token de desenvolvedor




## Orquestrador

Nesse projeto, um Orquestrador foi criado do zero para organizar o fluxo do Bot
e gerenciar as mensagens recebidas pela Zenvia.


**Como o Orquestrador funciona**

![Fluxo](https://i.imgur.com/Y9iuCcC.jpg)


**Node Flow**

Os Nós (Nodes) são classes com IDs específicos que rodam
um pedaço da lógica do Bot. 


Os nós podem ser executados por outros nós ou pela interação do usuário.

Todo nó recebe algum tipo de input ou informação extra.

Para saber mais como nós funcionam, [clique aqui](#node-docs).

## Instalação e Execução

Versão Recomendada NodeJS: v12.13.0

```bash
  git clone https://github.com/NameThatSong/Orchestrator.git

  cd Orchestrator

  npm install

  Para development:

  npm run dev

  Para production:

  npm run build

  npm run start

```

Depois de rodar o programa, é necessário configurar a sua conta Zenvia.

É recomendável ler [a documentação da Zenvia](https://zenvia.github.io/zenvia-openapi-spec/v2/#section/Getting-started-with-Sandbox) para ter um guia caso não conheça a plataforma.
    
## Variáveis de Ambiente

Para o Bot funcionar, é necessário as chaves:

`ZENVIA_TOKEN=Token da Zenvia`

`AUDD_TOKEN=Token da AudD`

`GOOGLE_APPLICATION_CREDENTIALS=Credenciais baixadas da plataforma do Google (default: gcp_credentials.json)`

`GENIUS_TOKEN=Credenciais da API da Genius`

`MONGODB_URL=Url de Conexão do MongoDB`

`CHANNEL=whatsapp`


## Node Docs

Abaixo segue um exemplo de um nó com métodos úteis

```ts
import AbstractNode from "../core/cortex/abstract-node";
import { UserInput } from "../core/cortex/input-types";

export default class Teste extends AbstractNode {

    public getID(): number {
        return 1; // Cada nó deve possuir um ID único para identificação e execução
    }

    public async run(input: UserInput): Promise<void> {
        
        if (input.isAudio()) {
            // Verifica se a input é audio
        }

        if (input.getMessage() === "Oi") {
            // Executa esse bloco de código se a mensagem for igual a 'Oi'

            // Roda o Nó de ID 2 com a mesma input recebida por esse Nó
            this.runNode(2, input);
        }

        if (input.getMessage() === "Quem é você?") {

        // Envia uma mensagem de texto para o usuário
        this.sendTextMessage("Olá, sou um Bot Teste!"); 

        // Envia uma mensagem de audio para o usuário, o tipo deve ser especificado (mpeg, mp4, etc)
        this.sendAudioMessage("url-do-audio", "audio/mpeg");

        }

        // É possível setar variáveis para este usuário específico
        // Para que no futuro elas possam ser recuperadas
        this.setGlobals({"idade": 25});
        this.setGlobals({"nome": "Marcela"},{"hobby": "vôlei"});

        this.getGlobals("hobby");
        this.getGlobals("idade", "nome"); // Retorno: {idade: 25, nome: "Marcela"}

        // Na próxima vez que o usuário interagir, ele será mandado para este nó
        this.setNextInteractionNode(5);

    }

}

```

## Squad Ômega

- Ana Luiza Monteiro
- Gabriel Freitas
- Marcos Flávio Kicis
- Nicolas Oliveira


## Extra

**Árvore Inicial do Bot**

Árvore de desenvolvimento utilizada como referência
![Fluxo](https://i.imgur.com/zjfdgBU.png)
