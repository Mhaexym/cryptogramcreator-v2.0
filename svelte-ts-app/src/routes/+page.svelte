<script lang="ts">
    import Grid from "$lib/components/grid.svelte";
    import Input from '$lib/components/input.svelte';
</script>

<div class="title bordered bottom">
    <div class="title_item"></div>
    <h1 class="title_item">Cryptogramcreator v2.0</h1>
    <div class="title_item name"><p><a href="https://github.com/Mhaexym/cryptogramcreator-v2.0">Github</a>  <br/> door Maxim Gehlmann</p></div>
</div>
<div class="row">
    <div class="column space_around">
        <Input/>
        <h2>Uitleg</h2>
        <div style="text-align:left">
            <p>Deze Cryptogramcreator is gemaakt om van een lijst woorden automatisch een cryptogram-grid te bouwen.</p>
            <p>>>>   Druk op "Genereer grid" om de voorbeeldwoorden in een grid te plaatsen.</p>
            <p>
                Er zijn momenteel twee grid-constructor algoritmes geimplementeerd. De "Naive Single-shot" pakt 
                telkens het best-scorende woord (zie Score-instellingen) en plaatst die meteen op het grid. Dit klinkt goed, 
                maar kan slechte resultaten opleveren, zoals te zien is bij "NIKS GEKS TE ZIEN".
            </p>
            <p>>>>   Verander het algoritme naar "Breadth First Search", 
                druk op "Wis grid" en weer op "Genereer grid".
            </p>
            <p>
                De "Breadth First Search"
                genereert eerst alle lengte-2-permutaties van woordvolgordes om de puzzel mee te starten, en bouwt met iedere permutatie vervolgens een puzzel. De beste uit alle
                verzamelde puzzels wordt gekozen en gepresenteerd. Zo zie je dat er nu inderdaad niks geks meer te zien is.   
            </p>
        </div>
    </div>
    <div class="column space_around">
        <Grid/>
    </div>
</div>

<style>
    *{
        font-family: 'Courier New', Courier, monospace;
        box-sizing: border-box;
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
    
    :global(h1, h2){
        text-align: center;
    }
    
    :global(.bordered){
        border: 2px dotted;
        
        &.bottom{
            border: none;
            border-bottom: 2px dotted;
        }
    }
    
    :global(.text-black){
        color : black;
    }
    
    :global(.text-left){
        text-align : left;
    }
    
    :global(.text-center){
        text-align : center;
    }
    
    :global(.row) {
        display: flex;
    }
    
    :global(.column) {
        max-width: 50%;
        padding: 5px 10px;
    }
    
    
    :global(.space_around){
        align-content:space-around;
    }
    
    :global(.cell){
        outline: 2px solid;
        height: 20px;
        width: 20px;
        padding: 0;
        margin: -2px;
        text-align: center;
        
        &:hover{
            background: black;
        }
    }
    
    :global(.d-block){
        display: block;
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