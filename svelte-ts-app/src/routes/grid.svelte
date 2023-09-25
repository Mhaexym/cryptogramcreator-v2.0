<script lang="ts">
    import { WORDS, cryptogram } from "$lib/stores";
    import { initCells, generatePuzzle} from "$lib/single-builder";

    function handleGenerate(){
        $cryptogram = generatePuzzle($WORDS, $cryptogram)
        printable_grid = $cryptogram.cells[0].map((_, colIndex) => $cryptogram.cells.map(row => row[colIndex]));
    }

    $cryptogram.cells = initCells($cryptogram);
    //Transposition because of having to print within #each statement
    let printable_grid = $cryptogram.cells[0].map((_, colIndex) => $cryptogram.cells.map(row => row[colIndex]));
</script>


<h2>Grid</h2>
<table class="bordered table_center">
    {#each printable_grid as crypto_row}
    <tr>
        {#each crypto_row as cell}
        <td class="cell" style="background: {cell.background}">{cell.content}</td>
        {/each}
    </tr>
    {/each}
</table>
<div>
    <button class="m-1" on:click|preventDefault={handleGenerate}>Genereer grid</button>
</div>
