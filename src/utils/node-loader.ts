import AbstractNode from "../core/cortex/abstract-node";
import nodeEngine from "../core/node-engine";
import { isNumeric } from "./helper-functions";

function loadAllNodes(): void {
    const allModules: { [key: string]: NodeRequire } = {};
    if (process.env.NODE_ENV == "dev") {
        require("fs")
            .readdirSync(__dirname + "/../nodeflow/")
            .forEach(function (file) {
                if (file.match(/\.ts$/) !== null && file !== "index.ts") {
                    var name = file.replace(".ts", "");
                    allModules[name] = require("./../nodeflow/" + file);
                }
            });
    } else {
        require("fs")
            .readdirSync(__dirname + "/../nodeflow/")
            .forEach(function (file) {
                if (file.match(/\.js$/) !== null && file !== "index.js") {
                    var name = file.replace(".js", "");
                    allModules[name] = require("./../nodeflow/" + file);
                }
            });
        for (const module in allModules) {
            new (allModules[module] as any).default();
        }
    }

    // Set Alias
    for (const module in allModules) {
        const node = new (allModules[module] as any).default() as AbstractNode;
        if (module.split('-').length > 1 && isNumeric(module.split('-')[0])) {
            nodeEngine.setAlias(Number(module.split("-")[0]), node.getID());
        }
    }
}

export default loadAllNodes;
