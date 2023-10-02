<script lang="ts">
    import { WORDS, cryptogram, weights } from "$lib/stores";
    import { emptyPuzzle, fillPuzzle} from "$lib/utils/single-builder";
    import { fillpuzzleBFS } from "$lib/utils/bfs-builder";
    import { tick } from "svelte";
    
    let gridWidth  : number = 16;
    let gridHeight : number = 22;
    let gridContainerWidth : number;
    let gridContainerHeight : number;
    let maxCellsWide : number; 
    let maxCellsHigh : number;

    $cryptogram.width = gridWidth;
    $cryptogram.height = gridHeight;
    $cryptogram = emptyPuzzle($cryptogram);
    let algo : string = 'NSS';
    //Transposition because of having to print within #each statement
    let printable_grid = $cryptogram.cells[0].map((_, colIndex) => $cryptogram.cells.map(row => row[colIndex]));

    $: maxCellsWide = Math.floor(gridContainerWidth / 22);
    $: maxCellsHigh = Math.floor(gridContainerHeight / 22);
    
    $: maxCellsWide < gridWidth? gridWidth = maxCellsWide : 0;
    $: maxCellsHigh < gridHeight? gridHeight = maxCellsHigh : 0;
    
    $: $cryptogram = emptyPuzzle($cryptogram);
    
    function handleGenerate(){
        $cryptogram.width = gridWidth;
        $cryptogram.height = gridHeight;
        $cryptogram = emptyPuzzle($cryptogram);
        syncLegalityToWords();
        if(algo == 'NSS'){
            $cryptogram = fillPuzzle($WORDS, $cryptogram, $weights)
            printable_grid = $cryptogram.cells[0].map((_, colIndex) => $cryptogram.cells.map(row => row[colIndex]));
            syncLegalityToWords();
        }
        else if(algo == 'BFS'){
            $cryptogram = fillpuzzleBFS($WORDS, 3, $weights, $cryptogram)
            printable_grid = $cryptogram.cells[0].map((_, colIndex) => $cryptogram.cells.map(row => row[colIndex]));
            syncLegalityToWords();
        }
    }
    
    function clearGrid(){
        $cryptogram.width = gridWidth;
        $cryptogram.height = gridHeight;
        $cryptogram = emptyPuzzle($cryptogram);
        printable_grid = $cryptogram.cells[0].map((_, colIndex) => $cryptogram.cells.map(row => row[colIndex]));
        syncLegalityToWords();
    }
    
    function syncLegalityToWords(){
        let puzzleHasWords = Object.keys($cryptogram.wordPlacements).length > 0;
        for(let i = 0; i < $WORDS.length; i++){
            if(puzzleHasWords){
                $WORDS[i].canPlace ?  $WORDS[i].displayStyle = "font-weight:bold;" : $WORDS[i].displayStyle = 'text-decoration: line-through';
            }
            else{
                $WORDS[i].canPlace = true;
                $WORDS[i].displayStyle = ""
            }
        }
    }
    
</script>


<h2>Grid</h2>
<div class="bordered h-500" bind:clientWidth={gridContainerWidth} bind:clientHeight={gridContainerHeight}>
    <table class="table_center text-black">
        {#each printable_grid as crypto_row}
        <tr>
            {#each crypto_row as cell}
            <td class="cell" style="background: {cell.background}">{cell.content}</td>
            {/each}
        </tr>
        {/each}
    </table>
</div>
<div style="text-align:left">
    <fieldset>
        <legend>Selecteer een algoritme</legend>
        <div>
            <input type="radio" id="NSS" name="algo" value="NSS" checked bind:group={algo}  />
            <label for="NSS">Naive Single-shot (snel, prima)</label>
        </div>
        <div>
            <input type="radio" id="BFS" name="algo" value="BFS" bind:group={algo}/>
            <label for="BFS">Breadth-first-search (langzamer, beter)</label>
        </div>
    </fieldset>
    <fieldset class="row">
        <legend>Gridgrootte</legend>
        <div class="column" style="float:left">
            <label for="width" class=d-block>Breedte</label>
            <label for="height" class=d-block>Hoogte</label>
        </div>
        <div class="column" style="float:left; width:auto">
            <input type="number" id="width" min=5 max={maxCellsWide} bind:value={gridWidth} class=d-block/>
            <input type="number" id="height" min=5 max={maxCellsHigh} bind:value={gridHeight} class=d-block/>
        </div>
    </fieldset>
    <button class="m-1" on:click|preventDefault={handleGenerate}>Genereer grid</button>
    <button class="m-1" on:click|preventDefault={clearGrid}>Wis grid</button>
</div>
<h2>Score-instellingen</h2>
A
<input type='number' min=0 max=1 step=0.05 bind:value={$weights[0]}>
B 
<input type='number' min=0 max=1 step=0.05 bind:value={$weights[1]}>
C
<input type='number' min=0 max=1 step=0.05 bind:value={$weights[2]}>
D
<input type='number' min=0 max=1 step=0.05 bind:value={$weights[3]}>
<div style="text-align:left">
    
    <p>De score voor de plaatsing van een woord in het generatieproces is vierdelig, waarvan het belang van elk deel wordt bepaald door
        een weight. De score wordt daarmee als volgt berekend:
    </p>
    <pre>
        totaalscore = A * score_A + B * score_B + C * score_C + D * score_D
        
        waarbij:
        score_A = belang van het maken van letterverbindingen ("interacties") met andere woorden
        score_B = belang van de balans tussen verticale en horizontale woorden in de gehele puzzel
        score_C = belang van hoezeer een woord middenin de puzzel ligt
        score_D = belang van hoe lang een woord is ten opzichte van de maximaal mogelijke lengte binnen de puzzel
    </pre>
</div>

