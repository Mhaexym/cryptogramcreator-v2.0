<script lang="ts">
    import { newId, WORDS } from "$lib/stores";
    import type { Cryptogram, Cell, Word } from "$lib/stores";
    
    function handleTextInput(event: KeyboardEvent){
        if (event.target){
            const target = event.target as HTMLInputElement;
            if (event.key === 'Enter' && target.value) {
                // Keep focus on input field for entering multiple words
                event.preventDefault(); 
                addSingleWord(target.value);
                target.value = "";
            }
        }
    }
    
    function clearAll(){
        $WORDS = []
    }
    
    function addSingleWord(word_string : string){
        if(word_string.length > 1){
            let value = word_string.trim().toUpperCase();
            // Reduce multiple whitespaces to single whitespace
            value = value.replace(/\s\s+/g, ' '); 
            value = value.replace("IJ", "Y"); 
            
            // Convert length to conventional format, remove spaces in between
            let split = value.split(" ");
            
            
            let lengths : number[] = [];
            if (split.length > 1){
                for (let i in split){
                    lengths = [...lengths, split[i].length];
                }
            }
            else{
                lengths = [...lengths, value.length]
            }
            
            let grid_text = split.join("");
            let grid_length = grid_text.length;
            // Initiate word-model
            var word : Word = {
                id: $newId,
                text: grid_text,
                display : value,
                display_style : "",
                length_clue : lengths,
                length_total : grid_length,
                clue: "",
                canPlace: true
            }
            // Update words
            $WORDS = [word, ...$WORDS];
            $newId += 1;
        }
    }
    
    function handleCSVInput(event : Event){
        if (event.target){
            const target = event.target as HTMLInputElement;
            if (target.files){
                let file = target.files[0];
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    var string_result = reader.result as String;
                    const result_arr = string_result.split("\r\n")
                    for(let i = 0; i < result_arr.length; i++) {
                        addSingleWord(result_arr[i]);
                    }
                }
                
                reader.onerror = () => console.log(reader.error);
            }
        }
    }
    
    function deleteFile(event : Event){
        var target = event.target as HTMLInputElement
        target.value = '';
    }
    
    function deleteWord(id : number){
        // Remove word from words-dict by id
        let wordIndex = $WORDS.findIndex(word => word.id == id)
        $WORDS.splice(wordIndex, 1);
        $WORDS = $WORDS;
    }
    
</script>

<h2>Input</h2>
{#if $WORDS.length}
<div class="w-100 mh-100 bordered h-500">
    <table class="table_center w-100">
        {#each $WORDS as word}
        <tr class="w-100" style={word.display_style}>
            {word.display} ({word.length_clue})
            <button on:click="{() => deleteWord(word.id)}" class="float-end">Verwijder</button>
        </tr>
        {/each}
    </table>
</div>
<button on:click={clearAll} class="m-1">Alles verwijderen</button>
{/if}
<div class="row">
    <div class="column">
        <p>Typ een woord:</p>
        <input id="input" on:keydown={handleTextInput} type='text' placeholder="Vul een antwoord in..."/>
    </div>
    <div class="column">
        <p>Of upload een .CSV file</p>    
        <input type="file" accept=".csv" on:change={handleCSVInput} on:click={deleteFile}/>
    </div>
</div>


<style>
    .float-end{
        float:right;
    }
    
    .w-100{
        width: 100%;
    }
    
    .mh-100{
        max-height: 70vh;
        overflow-y: scroll;
    }
    
</style>