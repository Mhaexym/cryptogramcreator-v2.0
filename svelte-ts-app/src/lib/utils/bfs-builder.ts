import type { Cryptogram, Word } from "$lib/stores";
import { fillPuzzle } from "./single-builder";

export function fillpuzzleBFS(words : Word[], depth = 2, weights : number[], templatePuzzle : Cryptogram){
    let wordsCopy = Object.assign([] as Word[], words);
    let puzzleSeeds = generatePuzzleSeeds([],wordsCopy,depth,[])
    let bestCryptogram = {} as Cryptogram;
    let bestScore = -1;

    for(let i = 0; i < puzzleSeeds.length; i++){
        let currPuzzle = Object.assign({} as Cryptogram, templatePuzzle)
        let seededPuzzle = fillPuzzle(puzzleSeeds[i], currPuzzle, weights)
        let restOfWords = wordsCopy.filter((word => !puzzleSeeds[i].includes(word)))
        let finishedPuzzle = fillPuzzle(restOfWords, seededPuzzle, weights)
        if(finishedPuzzle.totalScore > bestScore){
            bestScore = finishedPuzzle.totalScore;
            bestCryptogram = finishedPuzzle;
        }
    }
    
    return bestCryptogram
}    

function generatePuzzleSeeds(perm : Word[], allWords : Word[], maxDepth : number, perms_out : Word[][]){
    if(perm.length == maxDepth){
        // console.log("currdepth", currDepth, "maxdepth", maxDepth, "perms_out", perms_out, "perm", perm)
        // perm is correct
        perms_out.push(perm);
    }
    else{
        for(let i = 0; i < allWords.length; i++){
            let newPerm = [...perm, allWords[i]];
            let restOfWords = allWords.slice(0,i).concat(allWords.slice(i + 1))
            generatePuzzleSeeds(newPerm, restOfWords, maxDepth, perms_out)
        }
    }
    return perms_out
}