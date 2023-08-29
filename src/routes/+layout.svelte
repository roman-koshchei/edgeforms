<script lang="ts">
  import "../app.css"
</script>

<svelte:head>
  <!-- <title>${title}</title>
<meta name="description" content="${description}" /> -->

  <!-- <meta property="og:url" content="https://grids.fluriumteam.workers.dev/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta
          property="og:image"
          content="https://grids.fluriumteam.workers.dev/public/og.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="grids.fluriumteam.workers.dev" />
        <meta property="twitter:url" content="https://grids.fluriumteam.workers.dev/" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta
          name="twitter:image"
          content="https://grids.fluriumteam.workers.dev/public/og.png"
        /> -->

  <!-- <link rel="icon" type="image/png" href="/public/favicon.png" sizes="16x16" />
        <link rel="shortcut icon" type="image/x-icon" href="/public/favicon.ico" />
        <link rel="stylesheet" href="/public/pico.min.css" /> -->
</svelte:head>

<header />

<main class="container">
  <slot />
</main>

<footer />

<style>
  main {
    padding: var(--block-spacing-vertical) 0;
  }

  @media (min-width: 576px) {
    footer,
    header,
    main {
      --block-spacing-vertical: calc(var(--spacing) * 2.5);
    }
  }
</style>
