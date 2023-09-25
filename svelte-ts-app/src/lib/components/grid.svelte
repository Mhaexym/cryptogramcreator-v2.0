<script lang="ts">
    import { WORDS, cryptogram } from "$lib/stores";
    import { initCells, generatePuzzle} from "$lib/utils/single-builder";
    
    $cryptogram.cells = initCells($cryptogram);
    //Transposition because of having to print within #each statement
    let printable_grid = $cryptogram.cells[0].map((_, colIndex) => $cryptogram.cells.map(row => row[colIndex]));
    let weights = [0.8, 0.05, 0.1, 0.05]
    
    function handleGenerate(){
        $cryptogram = generatePuzzle($WORDS, $cryptogram, weights)
        printable_grid = $cryptogram.cells[0].map((_, colIndex) => $cryptogram.cells.map(row => row[colIndex]));
        syncLegalityToWords();
    }
    
    function clearGrid(){
        $cryptogram.cells = initCells($cryptogram);
        $cryptogram.wordPlacements = {};
        printable_grid = $cryptogram.cells[0].map((_, colIndex) => $cryptogram.cells.map(row => row[colIndex]));
        syncLegalityToWords();
    }
    
    function syncLegalityToWords(){
        let puzzleHasWords = Object.keys($cryptogram.wordPlacements).length > 0;
        for(let i = 0; i < $WORDS.length; i++){
            if(puzzleHasWords){
                $WORDS[i].canPlace ?  $WORDS[i].display_style = "font-weight:bold;" : $WORDS[i].display_style = 'text-decoration: line-through';
            }
            else{
                $WORDS[i].canPlace = true;
                $WORDS[i].display_style = ""
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
<div>
    <button class="m-1" on:click|preventDefault={handleGenerate}>Genereer grid</button>
    <button class="m-1" on:click|preventDefault={clearGrid}>Wis grid</button>
</div>
<div >
    <h2>Scoring</h2>
    A
    <input type='number' min=0 max=1 step=0.05 bind:value={weights[0]}>
    B 
    <input type='number' min=0 max=1 step=0.05 bind:value={weights[1]}>
    C
    <input type='number' min=0 max=1 step=0.05 bind:value={weights[2]}>
    D
    <input type='number' min=0 max=1 step=0.05 bind:value={weights[3]}>
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
    
</div>
