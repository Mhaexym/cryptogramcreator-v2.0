import { writable } from "svelte/store";

export const newId = writable(0)

export type Cryptogram = {
    width : number,
    height : number,
    cells : Cell[][],
    wordPlacements : { [key : number]: Placement},
    verticalCount : number,
    horizontalCount: number,
}

export type Word = {
    id: number, 
    text: string,
    display : string,  
    length_clue : number[],
    length_total : number,
    clue : string
}

export type Cell = {
    x : number,
    y : number,
    content : string,
    background : string
}

export type Placement = {
    word : Word,
    start : Cell,
    orientation : string,
    score : number
}

export const WORDS = writable<Word[]>([]);
export var cryptogram = writable<Cryptogram>({
    width: 16,
    height: 22,
    cells: [],
    wordPlacements : {},
    verticalCount: 0,
    horizontalCount: 0
});
export var placements = writable({});
