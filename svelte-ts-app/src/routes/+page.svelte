<script lang="ts">
    import Grid from "$lib/components/grid.svelte";
    import Input from '$lib/components/input.svelte';
</script>

<div class="title bordered bottom"><div class="title_item"></div><h1 class="title_item">Cryptogramcreator v2.0</h1><div class="title_item name">door Maxim Gehlmann</div></div>
<div class="row">
    <div class="column">
        <Input/>
        <h2>Uitleg</h2>
        <div style="text-align:left">
            <p>Deze Cryptogramcreator is gemaakt om van een lijst woorden automatisch een cryptogram-grid te bouwen.</p>
            <pre>>>>   Druk op "Genereer grid" om de voorbeeldwoorden in een grid te plaatsen.</pre>
            <p>
                Er zijn momenteel twee grid-constructor algoritmes geimplementeerd. De "Naive Single-shot" pakt 
                telkens het best-scorende woord (zie Score-instellingen) en plaatst die meteen op het grid. Dit klinkt goed, 
                maar kan slechte resultaten opleveren, zoals te zien is bij "NIKS GEKS TE ZIEN".
            </p>
            <pre>>>>   Verander het algoritme naar "Breadth First Search", 
            druk op "Wis grid" en weer op "Genereer grid".
            </pre>
            <p>
                De "Breadth First Search"
                genereert eerst alle lengte-2-permutaties van woordvolgordes om de puzzel mee te starten, en bouwt met iedere permutatie vervolgens een puzzel. De beste uit alle
                verzamelde puzzels wordt gekozen en gepresenteerd. Zo zie je dat er nu inderdaad niks geks meer te zien is.   
            </p>
        </div>
    </div>
    <div class="column">
        <Grid/>
    </div>
</div>

<style>
    *{
        font-family: 'Courier New', Courier, monospace;
    }
    
    :global(.bordered){
        border: 2px dotted;
        
        &.bottom{
            border: none;
            border-bottom: 2px dotted;
        }
    }

    .title{
        display: flex;
        justify-items: baseline;
    }

    .title_item{
        display: flex;
        flex: 1;
        justify-content: center;

        &.name{
            justify-content: end;
            align-items: end;
        }
    }
    
    :global(.text-black){
        color : black;
    }
    
    :global(.row) {
        display: flex;
    }
    
    :global(.column) {
        flex: 45%;
        text-align: center;
        align-content:space-around;
        padding: 5px 10px;
    }
    
    :global(.cell){
        outline: 2px solid;
        height: 20px;
        width: 20px;
        padding: 0;
        margin: -2px;
        
        &:hover{
            background: black;
        }
    }
    
    :global(.table_center){
        margin-left: auto;
        margin-right: auto;
    }
    
    :global(.m-1){
        margin: 1rem;
    }
    
    :global(.h-500){
        height:500px;
    }
    
    :global(body){
        background-color: black;
        color: white;
    }
</style>