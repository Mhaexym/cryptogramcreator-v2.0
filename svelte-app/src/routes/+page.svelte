<script>
    let words = [];

    function handleKeyDown(event){
        if (event.key === 'Enter' && event.target.value) {
			const word = { word: event.target.value, desc : 'none'};
        words = [word, ...words];
        
    }}
</script>
<h1>Cryptogramcreator</h1>

<input on:keydown={handleKeyDown} type='text'/>
<ul>
{#each words as word}
    <li>{word.desc} ({word.word.length})</li>
{/each}
</ul>