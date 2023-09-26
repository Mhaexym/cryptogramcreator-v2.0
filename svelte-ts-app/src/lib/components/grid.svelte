<script lang="ts">
    import { WORDS, cryptogram, weights } from "$lib/stores";
    import { emptyPuzzle, fillPuzzle} from "$lib/utils/single-builder";
    import { fillpuzzleBFS } from "$lib/utils/bfs-builder";
    
    let algo : string = 'NSS';
    $cryptogram = emptyPuzzle($cryptogram);
    //Transposition because of having to print within #each statement
    let printable_grid = $cryptogram.cells[0].map((_, colIndex) => $cryptogram.cells.map(row => row[colIndex]));
    
    function handleGenerate(){
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
<div class="bordered h-500">
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

