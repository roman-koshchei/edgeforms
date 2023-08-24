import { html } from "hono/html"
import type { HtmlEscapedString } from "hono/utils/html"

type Children = HtmlEscapedString[] | HtmlEscapedString

export function Layout(props: { children: Children; head?: Children }) {
  const title = "EdgeForms"
  const description = "Open Sourec valid forms all around the world."

  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>${title}</title>
        <meta name="description" content="${description}" />

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

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
        />
        ${PicoStyle()} ${props.head ?? ""}
      </head>

      <body>
        ${props.children}
      </body>
    </html>
  `
}

function PicoStyle() {
  return html`
    <style>
      [data-theme="light"],
      :root:not([data-theme="dark"]) {
        --primary: #3949ab;
        --primary-hover: #303f9f;
        --primary-focus: rgba(57, 73, 171, 0.125);
        --primary-inverse: #fff;
      }
      @media only screen and (prefers-color-scheme: dark) {
        :root:not([data-theme]) {
          --primary: #3949ab;
          --primary-hover: #3f51b5;
          --primary-focus: rgba(57, 73, 171, 0.25);
          --primary-inverse: #fff;
        }
      }
      [data-theme="dark"] {
        --primary: #3949ab;
        --primary-hover: #3f51b5;
        --primary-focus: rgba(57, 73, 171, 0.25);
        --primary-inverse: #fff;
      }
      :root {
        --form-element-active-border-color: var(--primary);
        --form-element-focus-color: var(--primary-focus);
        --switch-color: var(--primary-inverse);
        --switch-checked-background-color: var(--primary);
      }
    </style>
  `
}
