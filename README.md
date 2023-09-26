# Cryptogramcreator v2.0 - alpha
Deze Cryptogramcreator (WIP) is gemaakt om van een lijst woorden automatisch een cryptogram-grid te bouwen. Er zijn momenteel twee grid-constructor algoritmes geimplementeerd. De "Naive Single-shot" pakt telkens het best-scorende woord (zie Score-instellingen) en plaatst die meteen op het grid. De "Breadth First Search" genereert eerst alle lengte-n-permutaties (n=2 alleen intern aanpasbaar, want O(n!)) van woordvolgordes om de puzzel mee te starten, en bouwt met iedere permutatie vervolgens een puzzel. De beste uit alle verzamelde puzzels wordt gekozen en gepresenteerd. Zie ook: [geplande features](#geplande-features).

> Gebruik screen-capture (Win+Shift+S) om een screenshot te maken van je cryptogram, en je kunt 'm zo uitprinten! Een betere manier om cryptogrammen te downloaden als PDF moet nog volgen.

## Uitleg
### Hoe run ik Cryptogramcreator?
Er zit een executable bij het programma, waardoor je deze zonder development-omgeving gewoon kunt runnen met 'Cryptogramcreator-v2.0.exe'. Om te developen, zie [development](#development).

### Hoe werkt Cryptogramcreator? 
De Cryptogramcreator opent standaard met een paar voorbeeldwoorden, waarvan m.b.v. de verschillende algoritmes een grid kan worden gebouwd. Je kunt deze verwijderen met `Alles verwijderen` en zelf woorden toevoegen door ze handmatig in te voeren en op enter te drukken, nog een woord te typen etc., of door een .CSV file te uploaden met één woord per value. Je kunt met de Score-instellingen spelen om verschillende dingen belangrijker of minder belangrijk te maken bij het maken van een grid en zo het resultaat aanpassen.
> Woorden uit het lijstje die op het grid zijn geplaatst worden dikgedrukt, en degene die niet geplaatst konden worden, worden doorgehaald. 

### Live-editing
Door alsmaar naar het grid te kijken en handmatig woorden in te voeren die qua letters goed passen tussen twee of meerdere woorden die er al staan, kun je (behouden wat bugs) een soort live-editing doen.  

### Development
Cryptogramcreator is geschreven in [Svelte](https://svelte.dev/), Sveltekit & Typescript en runt op [Node.js](https://nodejs.org/en/download). Open 'cryptogram-maker-nl' als project in je favoriete editor (ik raad VSCode aan voor Svelte) en run de volgende commands in je CLI. 

```bash
cd svelte-ts-app
npm install
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Geplande features
* Knop om cryptogram te downloaden als pdf of png. 
* Implementatie van fase 3: beschrijvingen toevoegen.
* Automatisch aanvullende woorden suggereren mbv databank Nederlandse taal. 