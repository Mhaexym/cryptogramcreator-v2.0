import { writable } from "svelte/store";

export const newId = writable(0)

export type Cryptogram = {
    width : number,
    height : number,
    cells : Cell[][],
    wordPlacements : Placement[],
    verticalCount : number,
    horizontalCount: number,
    totalScore : number
}

export type Word = {
    id: number, 
    text: string,
    display : string,
    displayStyle : string,
    lengthClue : number[],
    lengthTotal : number,
    clue : string
    canPlace : boolean;
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
    score : number,
    fits : number
}

export const INPUT_WORDS = writable<Word[]>([]);
export const GRID_WORDS = writable<Word[]>([]);

export var cryptogram = writable<Cryptogram>({
    width: 16,
    height: 22,
    cells: [],
    wordPlacements : [],
    verticalCount: 0,
    horizontalCount: 0,
    totalScore : 0
});
export var placements = writable({});
export var weights = writable<number[]>([0.8, 0.05, 0.1, 0.05]);
