import { Client } from "@zenvia/sdk";

import createWebhook from "./integrations/zenvia/zenvia-broker";
// import samira from "./integrations/zenvia/button-content";
import Logger from "./utils/default-logger";
import loadAllNodes from "./utils/node-loader";

import { connect } from "./database/mongo-connector";
import userSchema from "./database/models/user-model";

import createPlaylistInSpotify from "./controllers/spotify-controller";

class App {
    public async start() {
        // Retrieves all nodes from directory "nodeflow" and instantiates them
        loadAllNodes();

        // Connects to MongoDB
        await this.startDatabase();

        const channelType = process.env.CHANNEL;

        // Creates Zenvia Channel
        const channel = this.startZenviaClient(channelType);

        // Creates Zenvia Webhook
        const webhook = await createWebhook(channel, channelType);
        webhook.on("listening", () => {
            Logger.info("Webhook started and is listening on port 3000");
        });

        await createPlaylistInSpotify();
        // Starts Express server
        webhook.init();
    }

    public startZenviaClient(channelType: string) {
        const client = new Client(process.env.ZENVIA_TOKEN);
        const channel = client.getChannel(channelType as any);
        return channel;
    }

    public async startDatabase() {
        await connect(process.env.MONGODB_URL);
    }
}

export default App;
