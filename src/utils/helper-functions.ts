import NodeEngine from "../core/node-engine";


export function isNumeric(input: string | number) {
    return !isNaN(Number(input));
}

export default function getIDOrAlias(id: string | number): string {
    if (isNumeric(id)) {
        return NodeEngine.getAlias(Number(id));
    }
    return id as string;
}