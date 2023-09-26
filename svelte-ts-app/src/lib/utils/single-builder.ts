import type {  Cryptogram, Word, Cell, Placement } from "../stores";

export function emptyPuzzle(cryptogram : Cryptogram){
    /*
    > Empties the cells, placements and counts of the given cryptogram, e.g. reinits with width & height.
    */
    
    const MAX_X = cryptogram.width - 1;
    const MAX_Y = cryptogram.height - 1;
    
    var cells = new Array(MAX_X);
    for(let x = 0; x <= MAX_X; x++){
        cells[x] = new Array(MAX_Y);
        for(let y = 0; y <= MAX_Y; y++){
            
            cells[x][y] = {
                x : x,
                y : y,
                // '_' means empty: everything allowed in this cell.
                content: "_", 
                // Empty cells are made black as per convention and it masks the parsing characters
                background: "black" 
            }
        }
    }
    cryptogram.wordPlacements = [];
    cryptogram.cells = cells as Cell[][];
    cryptogram.verticalCount = 0;
    cryptogram.horizontalCount = 0;
    cryptogram.totalScore = 0;
    
    return cryptogram
}



export function fillPuzzle(words : Word[], cryptogram : Cryptogram, weights : number[]){
    /*
    > Fills the given cryptogram with given words of which the placements 
    are scored with given weights.
    > loop depth: 1
    */
    
    // We don't want to edit the 'words' parameter, only use it in while-loop, so we copy it. 
    let wordsToPlace = Object.assign([] as Word[], words);
    while(wordsToPlace.length != 0){ 
        
        // Select best placement according to scores*weights of all words in all possible places
        let bestPossiblePlacement = findBestPossiblePlacement(words, wordsToPlace, cryptogram, weights);
        
        // Imprint the best placement with its word on the cryptogram
        cryptogram = confirmPlacement(bestPossiblePlacement, cryptogram);
        
        // Remove the placed word from the loop
        wordsToPlace.splice(wordsToPlace.findIndex((w) => w.id == bestPossiblePlacement.word.id), 1)
    }
    // cryptogram = removeIsolated(cryptogram)
    
    return cryptogram
}

function removeIsolated(cryptogram : Cryptogram){
    // WIP, not implemented yet!!
    let isolated : Placement[] = [];
    for(let i = 0; i < cryptogram.wordPlacements.length; i++){
        if(cryptogram.wordPlacements[i].fits == 0){
            isolated.push(cryptogram.wordPlacements[i])
        }
    }
    console.log(isolated)
    return cryptogram
}

function confirmPlacement(placement : Placement, cryptogram : Cryptogram){
    /*
    > Stamps letters from placement on cells from cryptogram and stamps parsing characters on surrounding cells.  
    Check readme or comments at 'blockFuture...' functions for a description of the parsing characters. 
    > Returns: Cryptogram
    > Letter placements should already be valid here, but legality of placing the parsing characters is
    checked in this function. 
    > loop depth: 2 
    */
    
    let {word, start, orientation, score} = placement;
    cryptogram.wordPlacements.push(placement);
    cryptogram.totalScore += score;
    let maxX = cryptogram.width - 1, maxY = cryptogram.height - 1;
    
    // We cannot place parsing characters outside the puzzle, so we check whether the word is on an edge.
    let onLeftEdge = start.x - 1 < 0;
    let onRightEdge = orientation == 'h'? start.x + word.lengthTotal> maxX : start.x + 1 > maxX;
    let onTopEdge = start.y - 1 < 0;
    let onBottomEdge = orientation == 'h'? start.y + 1 > maxY : start.y + word.lengthTotal> maxY;
    
    // Horizontal explained.
    if(orientation == 'h'){
        
        // "+" blocks ALL future placements in a cell: placed here before start and after end of the word. 
        if(!onLeftEdge) cryptogram.cells[start.x - 1][start.y].content = "+";
        if (!onRightEdge) cryptogram.cells[start.x + word.lengthTotal][start.y].content = "+";
        
        // Loop over letters in word
        for(let i = 0; i < word.lengthTotal; i++){
            
            // Place the letter
            cryptogram.cells[start.x + i][start.y].background = "white";
            cryptogram.cells[start.x + i][start.y].content = word.text.charAt(i);
            
            // Specifically block horizontal placement along the top and bottom of the current word.
            if(!onTopEdge) blockFutureHorizontal(cryptogram.cells[start.x + i][start.y - 1])
            if(!onBottomEdge) blockFutureHorizontal(cryptogram.cells[start.x + i][start.y + 1]);
            
            // Update count for future placement scoring.
            cryptogram.horizontalCount += 1;
        }
    }
    
    // Vertical, same idea
    else if(orientation == 'v'){
        if(!onTopEdge) cryptogram.cells[start.x][start.y - 1].content = "+";
        if (!onBottomEdge) cryptogram.cells[start.x][start.y + word.lengthTotal].content = "+";
        
        for(let i = 0; i < word.lengthTotal; i++){
            cryptogram.cells[start.x][start.y + i].background = "white";
            cryptogram.cells[start.x][start.y + i].content = word.text.charAt(i);
            
            if(!onLeftEdge) blockFutureVertical(cryptogram.cells[start.x - 1][start.y + i]);
            if(!onRightEdge) blockFutureVertical(cryptogram.cells[start.x + 1][start.y + i]);
            
            cryptogram.verticalCount += 1;
        }
    }
    return cryptogram
}


function blockFutureHorizontal(cell : Cell) : void{
    /*
    > Smartly places the horizontal blocker '|' in given cell
    */
    
    switch(cell.content){
        case "_":
        // If empty: in future block ONLY horizontal words in this cell with "|"
        cell.content = "|"
        break;
        case "-":
        // If it already has a vertical blocker "-" we stack the two rules into "+"
        cell.content = "+"
        break;
        // Else content already is "|" or is another letter: no action needed.
    }
}
function blockFutureVertical(cell : Cell) : void{
    /*
    > Smartly places the vertical blocker '-' in given cell
    */
    
    switch(cell.content){
        case "_":
        // If empty: in future block ONLY vertical words in this cell with "-"
        cell.content = "-"
        break;
        case "|":
        // If it already has a horizontal blocker "|" we stack the two rules into "+"
        cell.content = "+"
        break;
        // Else content already is "-" or is another letter: no action needed.
    }
}



function findBestPossiblePlacement(WORDS : Word[], wordsToPlace : Word[], cryptogram : Cryptogram, weights : number[]){
    /*
    > Finds the highest scoring possible placement of all placements of wordsToPlace on the given cryptogram.
    ignore: WORDS is updated for UI purposes, weights is passed on.
    > Returns: Placement
    > loop depth: 2
    */
    let bestPossiblePlacement : Placement = {word: {} as Word, start: {} as Cell, orientation :"", score : -1, fits: -1};
    let allPossibleWordPlacements : {[key : number] : Placement[][]} = {};
    
    // Loop over all words that still need to be placed.
    for(let i = 0; i < wordsToPlace.length; i++){
        
        // Find all possible placements for the word
        let placements = findPossiblePlacements(wordsToPlace[i], cryptogram, weights);
        allPossibleWordPlacements[wordsToPlace[i].id] = placements;
        
        // Simple 'current better than best?'-loop, checking first whether placements[0] (horizontal)
        // or placements[1] (vertical) are empty. If they're both empty, we flag the word, which will
        // later be used to update the input UI on the page.
        let currBestPlacement : Placement;
        if (placements[0].length == 0 && placements[1].length == 0){
            WORDS[WORDS.findIndex((w) => w.id == wordsToPlace[i].id)].canPlace = false;
            continue;
        }
        else if(placements[0].length > 0 && placements[1].length == 0) currBestPlacement = placements[0][0]
        else if(placements[0].length == 0 && placements[1].length > 0) currBestPlacement = placements[1][0];
        else currBestPlacement = placements[0][0].score > placements[1][0].score ? placements[0][0] : placements[1][0];
        
        bestPossiblePlacement = currBestPlacement.score > bestPossiblePlacement.score ? currBestPlacement : bestPossiblePlacement;
    }
    return bestPossiblePlacement
}




export function findPossiblePlacements(word : Word, cryptogram : Cryptogram, weights : number[]){
    /*
    > Finds and weight-scores all possible legal placements of given word on given cryptogram.
    > Returns: Placement[][], where all placements[0] are horizontal and placements[1] vertical.
    > loop depth: 3
    */
    
    let grid = cryptogram.cells;
    let wordLength = word.lengthTotal;
    let horizontalWordPlacements : Placement[] = [];
    let verticalWordPlacements : Placement[] = [];
    let returnPlacements : Placement[][] = [];
    let doneHorizontal = false, doneVertical = false;
    
    for(let x = 0; x < cryptogram.width; x++){
        // Per x-shift, check if we still need to search and verify HORIZONTAL placements based on word length
        doneHorizontal = x + wordLength > cryptogram.width;
        for(let y = 0; y < cryptogram.height; y++){
            // Per y-shift, check if we still need to search and verify VERTICAL placements based on word length
            doneVertical = y + wordLength > cryptogram.height;
            
            // Skip if there are no more HORIZONTAL & VERTICAL placements left in this column
            if((doneHorizontal) && (doneVertical)) continue;
            
            // Check if at least one of the orientations is still possible (can be both!)            
            else{
                var fitsH = 0
                var fitsV = 0
                // Store possible orientations
                var canBePlaced = {h : false, v : false};
                
                if(!doneHorizontal){
                    // Get placement legality and number of letter interactions of word with existing cryptogram.
                    let {placementAllowed, fits} = wordPlacementAllowed(word, grid[x][y], 'h', cryptogram)
                    if(placementAllowed){ 
                        canBePlaced.h = true;
                        fitsH = fits;
                    }
                }
                // Note: not else if.
                if(!doneVertical){
                    let {placementAllowed, fits} = wordPlacementAllowed(word, grid[x][y], 'v', cryptogram)
                    if(placementAllowed){
                        canBePlaced.v = true;
                        fitsV = fits;
                    }
                }
            }
            
            // Horizontal explained. 
            if(canBePlaced.h){
                // Score the placement of word on cryptogram (scoring explanation in aggregateWordScore)
                let score = aggregateWordScore(wordLength, grid[x][y], 'h', fitsH, cryptogram, weights);
                
                // Create a new placement for the word with score. 
                let placement : Placement = {word, start: grid[x][y], orientation:'h', score:score, fits:fitsH};
                
                // Save the placement (sort by score)
                // (note: may be better to save directly and sort whole list afterwards with a good algo)
                if(horizontalWordPlacements.length > 1){
                    for(let i = 0; i < horizontalWordPlacements.length; i++){
                        if(score > horizontalWordPlacements[i].score){ 
                            horizontalWordPlacements = 
                            [...horizontalWordPlacements.slice(0,i), placement, ...horizontalWordPlacements.slice(i)]
                            break;
                        }
                    }
                }
                else if(horizontalWordPlacements.length == 1){
                    score > horizontalWordPlacements[0].score ? 
                    horizontalWordPlacements = [placement, ...horizontalWordPlacements] : 
                    horizontalWordPlacements = [...horizontalWordPlacements, placement];
                }
                else horizontalWordPlacements = [...horizontalWordPlacements, placement]
            }
            
            // Vertical, same idea
            if(canBePlaced.v){
                let score = aggregateWordScore(wordLength, grid[x][y], 'v', fitsV, cryptogram, weights);
                let placement : Placement = {word, start: grid[x][y], orientation:'v', score:score, fits:fitsV};
                
                if(verticalWordPlacements.length > 1) {
                    for(let i = 0; i < verticalWordPlacements.length; i++){
                        if(score > verticalWordPlacements[i].score){
                            verticalWordPlacements = 
                            [...verticalWordPlacements.slice(0,i), placement, ...verticalWordPlacements.slice(i)]
                            break;
                        }
                    }
                }
                else if(verticalWordPlacements.length == 1){
                    score > verticalWordPlacements[0].score ? 
                    verticalWordPlacements = [placement, ...verticalWordPlacements] : 
                    verticalWordPlacements = [...verticalWordPlacements, placement];
                }
                else if(verticalWordPlacements.length == 0) verticalWordPlacements = [...verticalWordPlacements, placement]
            }
        }
    }    
    returnPlacements[0] = horizontalWordPlacements;
    returnPlacements[1] = verticalWordPlacements;
    return returnPlacements;
}


function wordPlacementAllowed(word : Word, start : Cell, orientation : string, cryptogram : Cryptogram){
    /*
    > Loops over letters in word and checks cells where it would be placed whether placement is legal there. 
    > Returns: {placementAllowed : boolean, fits : number}    
    > loop depth: 4
    */
    
    // Innocent until proven guilty. 
    let placementAllowed = true;
    let fits = 0;
    
    // Fill in a word : string here to console-debug this function for a specific word.  
    let debugWord = false;
    
    // Horizontal explained. 
    if(orientation == 'h'){
        // Loop over letters
        for(let i = 0; i < word.lengthTotal; i++){
            let letter = word.text.charAt(i)
            let content = cryptogram.cells[start.x + i][start.y].content
            let isStartOrEnd = (i == 0 || i+1 == word.lengthTotal) ? true : false;
            
            if(debugWord){
                console.log(letter, content, isStartOrEnd, orientation, start.x+i, start.y)
            }
            
            // Stop immediately if letter cannot be placed over content of cell, given orientation & start or end. 
            if(!letterPlacementAllowed(letter, content, orientation, isStartOrEnd)) {
                placementAllowed = false; 
                break;
            }
            
            // Update fits.
            fits += (letter == content)? 1 : 0;
        }
    } 
    
    // Vertical same (note: else if)
    else if(orientation == 'v'){
        for(let i = 0; i < word.lengthTotal; i++){
            let letter = word.text.charAt(i)
            let content = cryptogram.cells[start.x][start.y + i].content
            let isStartOrEnd = (i == 0 || i+1 == word.lengthTotal) ? true : false;
            if(debugWord) console.log(letter, content, isStartOrEnd, orientation, start.x, start.y+i)
            if(!letterPlacementAllowed(letter, content, orientation , isStartOrEnd)){ 
                placementAllowed = false; 
                break;
            }
            fits += (letter == content)? 1 : 0;
        }
    }
    
    return {placementAllowed, fits};
}


function letterPlacementAllowed(letter : string, content : string, orientation : string, isStartOrEnd : boolean){
    /*
    > Nested ternary to check legality of letter placement. Here it was once foolishly allowed to place any letters
    of vertical words on "|" and those of horizontal words on "-". Spot the problem (solution already given).
    > Returns: boolean    
    */
    let result = 
    content == "+" ? 
    false : 
    (orientation == "h" ? 
    (content === letter || content === "-" && !isStartOrEnd || content === "_") : 
    (content === letter || content === "|" && !isStartOrEnd || content === "_"))
    return result
}



function aggregateWordScore(wordLength: number, wordStart : Cell, wordOrientation: string, wordFits : number, cryptogram : Cryptogram, weights : number[]){    
    /*
    > Calculates four (currently) of a word placement and matrix-multiplies them with the given weights
    > Returns: number. 
    */
    
    let scores = [
        // Word-puzzle letter-fits divided by total possible fits for the word.
        scoreWordFits(wordLength, wordFits),
        // Word orientation gives a point if adds to whichever is the minority in the cryptogram.
        scoreWordPuzzleBalance(wordOrientation, cryptogram.horizontalCount, cryptogram.verticalCount),
        // Word centrality: how much in the center of the puzzle the middle of a word is. 
        scoreWordCentrality(wordLength, wordStart, wordOrientation, cryptogram.width, cryptogram.height),
        // Word length: how big is word vs. how big is puzzle
        scoreWordLength(wordLength, cryptogram.width, cryptogram.height)
    ]
    
    return scores.reduce((r, a, i) => {return r + a * weights[i]}, 0);
}


function scoreWordFits(wordLength : number, wordFits : number){
    return wordFits / Math.ceil(wordLength);
}


function scoreWordPuzzleBalance(wordOrientation : string, horizontalCount : number, verticalCount : number){
    let score;
    
    horizontalCount > verticalCount ?
    (wordOrientation == 'v' ? score = 1 : score = 0) : 
    (wordOrientation == 'h' ? score = 1 : score = 0);
    
    return score
}


function scoreWordCentrality(wordLength : number, wordStart: Cell, wordOrientation : string, MAX_X : number, MAX_Y : number){
    // set constants for puzzle
    //  we allow fractions here for correctness. 
    let MID_X = (MAX_X / 2) - 0.5
    let MID_Y = (MAX_Y / 2) - 0.5
    let MID_PUZZLE = [MID_X, MID_Y];
    let MAX_DISTANCE = Math.sqrt(MID_X ** 2 + MID_Y ** 2)
    
    var middleOfWord : number[];
    
    (wordOrientation == 'h') ?
    middleOfWord = [wordStart.x + (wordLength/2 - 0.5) , wordStart.y] :
    // orientation == 'v'
    middleOfWord = [wordStart.x, wordStart.y + (wordLength/2 - 0.5)]
    
    // Return distance between middle of word and middle of puzzle, normalized to 0-1 by MAX_DISTANCE 
    return 1 - (distance(middleOfWord, MID_PUZZLE) / MAX_DISTANCE)
}


function scoreWordLength(wordLength : number, MAX_X : number, MAX_Y : number){
    return wordLength / Math.max(MAX_X, MAX_Y);
}


function distance(pointA : number[], pointB : number[]){
    return Math.sqrt((pointA[0] - pointB[0]) ** 2 + (pointA[1] - pointB[1]) ** 2);
}
