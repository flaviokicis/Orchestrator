import { config } from "dotenv";
import Config from "../config";
import DuplicatedNodeException from "../errors/duplicated-node-error";
import NoSuchNodeError from "../errors/no-such-node-error";
import Logger from "../utils/default-logger";
import AbstractNode from "./cortex/abstract-node";

// Implement a map where it stores the type of the class as value to the key being the ID number
// Instantiates the node and runs it

class NodeEngine {
    private nodeRegistry: Map<string, AbstractNode> = new Map();

    private alias: Map<number, string> = new Map();

    public addNodeToRegistry(id: string, node: AbstractNode) {
        if (this.nodeRegistry.has(id)) {
            throw new DuplicatedNodeException(
                `A Node with the ID ${id} has already been registed`,
            );
        }
        this.nodeRegistry.set(id, node);
        if (Config.DEBUG) {
            Logger.info(`Node registered with ID ${id}`);
        }
    }

    public getNodeFromRegistry(id: string): AbstractNode {
        if (this.isNodeSet(id)) {
            return this.nodeRegistry.get(id);
        }
        throw new NoSuchNodeError(`Node with ID ${id} does not exist.`);
    }

    public isNodeSet(id: string) {
        return this.nodeRegistry.has(id);
    }

    public setAlias(aliasID: number, nodeID: string) {
        if (this.aliasExists(aliasID)) {
            throw new DuplicatedNodeException(
                `A Node with the Alias ${aliasID} has already been registed`,
            );
        }
        this.alias.set(aliasID, nodeID);
        if (Config.DEBUG) {
            Logger.info(`Set Alias ${aliasID} for Node ${nodeID}`);
        }
    }

    public getAlias(aliasID: number) {
        return this.alias.get(aliasID);
    }

    public aliasExists(aliasID: number) {
        return this.alias.has(aliasID);
    }

}

export default new NodeEngine();
