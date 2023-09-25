<script lang="ts">
    import Grid from "./grid.svelte";
    import Input from './input.svelte';
</script>

    <h1 class="bordered bottom">Cryptogramcreator</h1>
    <div class="row">
        <div class="column">
            <Input/>
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
    
    h1{
        text-align: center;
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