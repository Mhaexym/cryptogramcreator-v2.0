import type {  Cryptogram, Word, Cell, Placement } from "../stores";

export function initCells(cryptogram : Cryptogram){
    const MAX_X = cryptogram.width - 1;
    const MAX_Y = cryptogram.height - 1;

    var cells = new Array(MAX_X);
    for(let x = 0; x <= MAX_X; x++){
        cells[x] = new Array(MAX_Y);
        for(let y = 0; y <= MAX_Y; y++){

            cells[x][y] = {
                x : x,
                y : y,
                content: "_",
                background: "black"
            }
        }
    }
    return cells as Cell[][]
}

export function generatePuzzle(WORDS : Word[], cryptogram : Cryptogram, weights : number[]){
    let wordsToPlace = Object.assign([] as Word[], WORDS);
    while(wordsToPlace.length != 0){ 
        let bestPossiblePlacement = findBestPossiblePlacement(WORDS, wordsToPlace, cryptogram, weights);
        cryptogram = confirmPlacement(bestPossiblePlacement, cryptogram);
        wordsToPlace.splice(wordsToPlace.findIndex((w) => w.id == bestPossiblePlacement.word.id), 1)
    }
    return cryptogram
}

function distance(point_1 : number[], point_2 : number[]){
    return Math.sqrt((point_1[0] - point_2[0]) ** 2 + (point_1[1] - point_2[1]) ** 2);
}

function findBestPossiblePlacement(WORDS : Word[], wordsToPlace : Word[], cryptogram : Cryptogram, weights : number[]){
    
    let bestPossiblePlacement : Placement = {word: {} as Word, start: {} as Cell, orientation :"", score : -1};
    let allPossibleWordPlacements : {[key : number] : Placement[][]} = {};
    
    for(let i = 0; i < wordsToPlace.length; i++){
        let placements = findPossiblePlacements(wordsToPlace[i], cryptogram, weights);
        allPossibleWordPlacements[wordsToPlace[i].id] = placements;
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

function confirmPlacement(placement : Placement, cryptogram : Cryptogram){
    let {word, start, orientation,} = placement;
    cryptogram.wordPlacements[word.id] = placement;
    let maxX = cryptogram.width - 1, maxY = cryptogram.height - 1;
    
    // Check if the word touches the edge of the puzzle, where right & bottom are dependent on the word's orientation
    let onLeftEdge = start.x - 1 < 0;
    let onRightEdge = orientation == 'h'? start.x + word.length_total> maxX : start.x + 1 > maxX;
    let onTopEdge = start.y - 1 < 0;
    let onBottomEdge = orientation == 'h'? start.y + 1 > maxY : start.y + word.length_total> maxY;

    // Horizontal explained.
    if(orientation == 'h'){
        
        // "+" blocks ALL future placements in a cell (used in cells before beginning and after end of word)
        if(!onLeftEdge) cryptogram.cells[start.x - 1][start.y].content = "+";
        if (!onRightEdge) cryptogram.cells[start.x + word.length_total][start.y].content = "+";
        
        // Loop over letters in word
        for(let i = 0; i < word.length_total; i++){
            
            // Place the letter
            cryptogram.cells[start.x + i][start.y].background = "white";
            cryptogram.cells[start.x + i][start.y].content = word.text.charAt(i);
            
            if(!onTopEdge) blockFutureHorizontal(cryptogram.cells[start.x + i][start.y - 1])
            if(!onBottomEdge) blockFutureHorizontal(cryptogram.cells[start.x + i][start.y + 1]);
            
            cryptogram.horizontalCount += 1;
        }
    }
    
    // Vertical, same idea
    else if(orientation == 'v'){
        if(!onTopEdge) cryptogram.cells[start.x][start.y - 1].content = "+";
        if (!onBottomEdge) cryptogram.cells[start.x][start.y + word.length_total].content = "+";
        
        for(let i = 0; i < word.length_total; i++){
            cryptogram.cells[start.x][start.y + i].background = "white";
            cryptogram.cells[start.x][start.y + i].content = word.text.charAt(i);
            
            if(!onLeftEdge) blockFutureVertical(cryptogram.cells[start.x - 1][start.y + i]);
            if(!onRightEdge) blockFutureVertical(cryptogram.cells[start.x + 1][start.y + i]);
            
            cryptogram.verticalCount += 1;
        }
    }
    return cryptogram
}

function blockFutureHorizontal(cell : Cell){
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
function blockFutureVertical(cell : Cell){
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


function findPossiblePlacements(word : Word, cryptogram : Cryptogram, weights : number[]){
    let grid = cryptogram.cells;
    let wordLength = word.length_total;
    let horizontalWordPlacements : Placement[] = [];
    let verticalWordPlacements : Placement[] = [];
    let returnPlacements : Placement[][] = [];
    let h_done = false, v_done = false;
    
    for(let x = 0; x < cryptogram.width; x++){
        h_done = x + wordLength > cryptogram.width;
        for(let y = 0; y < cryptogram.height; y++){
            v_done = y + wordLength > cryptogram.height;

            //Don't check any further squares in this column if the word reaches the edge in both directions
            if((h_done) && (v_done)) continue;

            //Do check if at least one of the orientations is still possible            
            else{
                var h_fits = 0
                var v_fits = 0
                var canBePlaced = {h : false, v : false};
                if(!h_done){
                    let {allowed, fits} = wordPlacementAllowed(word, grid[x][y], 'h', cryptogram)
                    if(allowed){ 
                        canBePlaced.h = true;
                        h_fits = fits;
                    }
                }
                if(!v_done){
                    let {allowed, fits} = wordPlacementAllowed(word, grid[x][y], 'v', cryptogram)
                    if(allowed){
                        canBePlaced.v = true;
                        v_fits = fits;
                    }
                }
            }

            if(canBePlaced.h){
                let score = aggregateWordScore(wordLength, grid[x][y], 'h', h_fits, cryptogram, weights);
                let placement : Placement = {word, start: grid[x][y], orientation:'h', score:score};

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

            if(canBePlaced.v){
                let score = aggregateWordScore(wordLength, grid[x][y], 'v', v_fits, cryptogram, weights);
                let placement : Placement = {word, start: grid[x][y], orientation:'v', score:score};

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


function aggregateWordScore(word_length : number, start : Cell, orientation: string, fits : number, cryptogram : Cryptogram, weights : number[]){    
    let scores = [
        scoreWordIntersections(word_length, fits),
        scoreWordPuzzleBalance(orientation, cryptogram.horizontalCount, cryptogram.verticalCount),
        scoreWordCentrality(word_length, start, orientation, cryptogram.width, cryptogram.height),
        scoreWordLength(word_length, cryptogram.width, cryptogram.height)
    ]
    
    return scores.reduce((r, a, i) => {return r + a * weights[i]}, 0);
}


function scoreWordIntersections(length : number, fits : number){
    return fits / (length / 2);
}


function scoreWordPuzzleBalance(orientation : string, horizontalCount : number, verticalCount : number){
    let score;
    
    horizontalCount > verticalCount ?
    (orientation == 'v' ? score = 1 : score = 0) : 
    (orientation == 'h' ? score = 1 : score = 0)
    
    return score
}


function scoreWordCentrality(length : number, start: Cell, orientation : string, maxX : number, maxY : number){
    let middleOfPuzzle = [maxX/2, maxY/2]
    let max_distance = Math.sqrt((maxX/2) ** 2 + (maxY/2) ** 2)
    var middleOfWord : number[];
    
    (orientation == 'h') ?
    middleOfWord = [start.x + length/2, start.y] :
    // orientation == 'v'
    middleOfWord = [start.x, start.y + length/2]
    
    return 1 - (distance(middleOfWord, middleOfPuzzle) / max_distance)
}


function scoreWordLength(length : number, maxX : number, maxY : number){
    return length / Math.max(maxX, maxY);
}


function wordPlacementAllowed(word : Word, start : Cell, orientation : string, cryptogram : Cryptogram){
    let allowed = true;
    let fits = 0;
    let debugWord = false;

    if(orientation == 'h'){
        for(let i = 0; i < word.length_total; i++){
            let letter = word.text.charAt(i)
            let content = cryptogram.cells[start.x + i][start.y].content
            let isStartOrEnd = (i == 0 || i+1 == word.length_total) ? true : false;

            if(debugWord){
                console.log(letter, content, isStartOrEnd, orientation, start.x+i, start.y)
            }

            if(!letterPlacementAllowed(letter, content, orientation, isStartOrEnd)) {
                allowed = false; 
                break;
            }
            fits += (letter == content)? 1 : 0;
        }
    } 
    
    else if(orientation == 'v'){
        for(let i = 0; i < word.length_total; i++){
            let letter = word.text.charAt(i)
            let content = cryptogram.cells[start.x][start.y + i].content
            let isStartOrEnd = (i == 0 || i+1 == word.length_total) ? true : false;

            if(debugWord){
                console.log(letter, content, isStartOrEnd, orientation, start.x, start.y+i)
            }
            if(!letterPlacementAllowed(letter, content, orientation , isStartOrEnd)){ 
                allowed = false; 
                break;
            }
            fits += (letter == content)? 1 : 0;
        }
    }
    else alert("Illegal orientation given in function: wordPlacementAllowed in single-builder.ts")
    return {allowed, fits};
}


function letterPlacementAllowed(letter : string, content : string, orientation : string, isStartOrEnd : boolean){
    let result = 
   content == "+" ? 
        false : 
        (orientation == "h" ? 
            (content === letter || content === "-" && !isStartOrEnd || content === "_") : 
            (content === letter || content === "|" && !isStartOrEnd || content === "_"))
    return result
}

