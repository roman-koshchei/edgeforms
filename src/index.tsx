import { Hono } from "hono"
import { html } from "hono/html"
import { HtmlEscapedString } from "hono/utils/html"

const app = new Hono()

function uuid() {
  return crypto.randomUUID()
}

function formFormat(from: FormData) {
  let result = {
    files: [] as File[],
    fields: [] as { key: string; values: string[] }[],
  }
  const entries = from.entries() as IterableIterator<[key: string, value: File | string]>
  for (const [key, value] of entries) {
    let str: string
    if (value instanceof File) {
      str = `${uuid()}`
      result.files.push(value)
    } else {
      str = value
    }

    const exist = result.fields.find((x) => x.key == key)
    if (!exist) {
      result.fields.push({ key: key, values: [str] })
    } else {
      exist.values.push(str)
    }
  }
  return result
}

app.get("/", (c) => c.html(page()))
app.get("/another", (c) => c.html(page()))

const forms = [
  { id: "tsnc-lbyb-klyy-zk52", userId: "t86c-l34b-klyy-z952", redirect: "/" },
  { id: "tqkl-l45b-oplt-mz72", userId: "t86c-l34b-klyy-z952", redirect: "/about" },
]

/*

- check rate limits
- find form by id and permissions
- get form fields and files
- check files size
- upload files to storage
- add submission to db
- send email if permission
- return redirect to page (saccess/fail)

*/
app.post("/simple/:id", async (c) => {
  try {
    const { id } = c.req.param()
    const dbForm = forms.find((x) => x.id == id)
    if (dbForm == null) return c.status(404) // ?

    const form = await c.req.formData()

    const { fields, files } = formFormat(form)
    console.log(fields.map((x) => `${x.key}:${x.values}`))

    const redirectPath = dbForm.redirect

    c.res.headers.append("back", redirectPath)

    return c.redirect("/success")
  } catch {
    return c.redirect("/failure")
  }
})

app.post("/html/:id", async (c) => {
  try {
    const { id } = c.req.param()
    const dbForm = forms.find((x) => x.id == id)
    if (dbForm == null) return c.status(404) // ?

    const form = await c.req.formData()

    const { fields, files } = formFormat(form)
    console.log(fields.map((x) => `${x.key}:${x.values}`))

    const redirectPath = dbForm.redirect

    c.res.headers.append("back", redirectPath)

    return c.html(
      <form edge={id}>
        <input type="text" name="name" placeholder="name" />
        <button type="submit">Stsrctrsend</button>
      </form>
    )
  } catch {
    return c.html(<div>Failure</div>)
  }
})

function style() {
  return html`
    <style>
      /* Indigo Light scheme (Default) */
      /* Can be forced with data-theme="light" */
      [data-theme="light"],
      :root:not([data-theme="dark"]) {
        --primary: #3949ab;
        --primary-hover: #303f9f;
        --primary-focus: rgba(57, 73, 171, 0.125);
        --primary-inverse: #fff;
      }

      /* Indigo Dark scheme (Auto) */
      /* Automatically enabled if user has Dark mode enabled */
      @media only screen and (prefers-color-scheme: dark) {
        :root:not([data-theme]) {
          --primary: #3949ab;
          --primary-hover: #3f51b5;
          --primary-focus: rgba(57, 73, 171, 0.25);
          --primary-inverse: #fff;
        }
      }

      /* Indigo Dark scheme (Forced) */
      /* Enabled if forced with data-theme="dark" */
      [data-theme="dark"] {
        --primary: #3949ab;
        --primary-hover: #3f51b5;
        --primary-focus: rgba(57, 73, 171, 0.25);
        --primary-inverse: #fff;
      }

      /* Indigo (Common styles) */
      :root {
        --form-element-active-border-color: var(--primary);
        --form-element-focus-color: var(--primary-focus);
        --switch-color: var(--primary-inverse);
        --switch-checked-background-color: var(--primary);
      }
    </style>
  `
}

const Layout = (props: { children: HtmlEscapedString[] | HtmlEscapedString }) => {
  const title = "EdgeForms"
  const description = "Forms all around the world."

  return html`
    <!DOCTYPE html>
    <html lang="en" style="scroll-behavior: smooth;">
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
        ${style()}
      </head>

      ${props.children}
    </html>
  `
}

app.get("/success", (c) => {
  const back = c.req.header("referer")
  return c.html(
    <Layout>
      <body
        class="container"
        style="height:90vh;overflow:hidden; display: flex;justify-content: center;align-items: center;"
      >
        <main style="width:100%;max-width:40rem;">
          <article>
            <h1>Thanks for submition</h1>

            {back ? (
              <a role="button" style="display:block;" href={back}>
                Back
              </a>
            ) : (
              <button
                style="margin:0rem;"
                onclick="if(document.referrer){window.location=document.referrer;}else{window.history.go(-1)}"
              >
                Back
              </button>
            )}
          </article>
          <p>
            Form is powered by <a href="/">EdgeForms</a>
          </p>
        </main>
      </body>
    </Layout>
  )
})

app.get("/failure", (c) => {
  const back = c.req.header("referer")

  return c.html(
    <html>
      <body>
        <h1>Form submision failed</h1>
        {back ? (
          <a href={back}>Back</a>
        ) : (
          <button onclick="if(document.referrer){window.location=document.referrer;}else{window.history.go(-1)}">
            Back
          </button>
        )}
      </body>
    </html>,
    500
  )
})

function page() {
  return (
    <html>
      <head>
        {html`<script>
          /** @param {SubmitEvent} event  */
          async function submit(event) {
            try {
              event.preventDefault()

              /** @type {HTMLFormElement | null} */
              const form = event.currentTarget
              if (form == null) return

              const id = form.getAttribute("edge")
              if (id == null || id.trim().length == 0) return

              const formData = new FormData(form)
              fetch("/html/" + id.trim(), { method: "POST", body: formData })
                .then((x) => x.text())
                .then((x) => (form.outerHTML = x))
                .catch((x) => (form.innerHTML = "AAAA"))
            } catch {
              return
            }
          }

          /**
           * @param {Node} node
           * @returns {boolean}
           */
          function isEdgeForm(node) {
            if (node.nodeType != Node.ELEMENT_NODE) return false
            if (node.nodeName != "FORM") return false
            if (!node.hasAttribute("edge")) return false
            return true
          }

          const observer = new MutationObserver(function (mutationsList) {
            for (const mutation of mutationsList) {
              if (mutation.addedNodes.length <= 0) continue

              for (const node of mutation.addedNodes) {
                if (!isEdgeForm(node)) continue
                node.addEventListener("submit", submit)
              }
            }
          })

          document.addEventListener("DOMContentLoaded", function () {
            const forms = document.querySelectorAll("form[edge]")
            for (let i = 0; i < forms.length; ++i) {
              const form = forms.item(i)
              form.addEventListener("submit", submit)
            }
            observer.observe(document.body, { childList: true, subtree: true })
          })

          async function goTop(event) {
            event.preventDefault()

            const form = event.currentTarget
            console.log(form)
            if (form == null) return

            const id = form.getAttribute("edge")
            //if (id == null || id.trim().length == 0) return
            console.log(form, id)
          }
        </script>`}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
        />
        {style()}
      </head>
      <body class="container">
        <main>
          <h1>EdgeForms: valid forms all around the worlds</h1>
          <article>
            {`
        <form edge="{id}">
          <input type="email" name="email" placeholder="Email" />
          <button type="submit">Join Waitlist</button>
        </form>`}
          </article>

          <form edge="tsnc-lbyb-klyy-zk52">
            <input type="email" name="email" placeholder="Email" />
            <button type="submit">Join Waitlist</button>
          </form>

          {/* <form
          action="/simple/tsnc-lbyb-klyy-zk52"
          method="post"
          enctype="multipart/form-data"
        >
          <input type="text" name="name" placeholder="name" />
          <input
            type="email"
            name="email"
            placeholder="email"
            value="romankoshchei@gmail.com"
          />
          <input type="date" name="date" />
          <input type="file" name="files" multiple />
          <button type="submit">Send</button>
        </form> */}

          {/* {testOtherTools()} */}
        </main>
      </body>
      {html`<script>
        function go(event) {
          event.preventDefault()
          alert("trci")
        }
      </script>`}
    </html>
  )
}

function testOtherTools() {
  return (
    <div>
      <h2>Formspee</h2>
      <form
        action="https://formspree.io/f/xaygoowl"
        method="POST"
        enctype="multipart/form-data"
      >
        <label>
          Your email:
          <input type="email" name="email" />
        </label>
        <label>
          Your email:
          <input type="date" name="qr" />
        </label>
        <label>
          Your message:
          <textarea name="message"></textarea>
        </label>
        <button type="submit">Send</button>
      </form>

      <h2>NocodeForm</h2>
      <form action="https://nocodeform.io/f/64e3b1465a6b8164b34f0dcd" method="POST">
        <input type="text" name="name" />
        <input type="email" name="email" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default app
