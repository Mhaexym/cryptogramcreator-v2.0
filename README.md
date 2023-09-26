# cryptogram-maker-nl
Deze Cryptogramcreator is gemaakt om van een lijst woorden automatisch een cryptogram-grid te bouwen.

> Druk op "Genereer grid" om de voorbeeldwoorden in een grid te plaatsen.

Er zijn momenteel twee grid-constructor algoritmes geimplementeerd. De "Naive Single-shot" pakt telkens het best-scorende woord (zie Score-instellingen) en plaatst die meteen op het grid. Dit klinkt goed, maar kan slechte resultaten opleveren, zoals te zien is bij "NIKS GEKS TE ZIEN".

>>>   Verander het algoritme naar "Breadth First Search", 
            druk op "Wis grid" en weer op "Genereer grid".
            
De "Breadth First Search" genereert eerst alle lengte-2-permutaties van woordvolgordes om de puzzel mee te starten, en bouwt met iedere permutatie vervolgens een puzzel. De beste uit alle verzamelde puzzels wordt gekozen en gepresenteerd. Zo zie je dat er nu inderdaad niks geks meer te zien is.

# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
