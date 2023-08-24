import { Hono } from "hono"
import { html } from "hono/html"
import { Layout } from "./frontend"
import { Example } from "./frontend/example"

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

type RequiredFormField = {}

type FormField =
  | {
      type: "text" | "email"
      min: number
      max: number
      isRequired: boolean
      isArray: boolean
    }
  | {
      type: "radio" | "checkbox" | "dropdown"
      values: string[]
      isRequired: boolean
    }
  | {
      type: "file"
      fileType: "image" | "any"
      isRequired: boolean
      isArray: boolean
    }
  | {
      type: "date" | "time"
      from: number
      to: number
    }
  | {
      type: "url" | "color"
      isRequired: boolean
      isArray: boolean
    }
  | {
      type: "range"
      min: number
      max: number
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
    fields.forEach((x) => console.log(`${x.key}: '${x.values}'`))

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
    fields.forEach((x) => {
      console.log(`${x.key}: '${x.values}'`)
    })

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
    <Layout>
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
    </Layout>,
    500
  )
})

function page() {
  return (
    <Layout
      head={html`<script>
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
      </script>`}
    >
      <main class="container">
        <hgroup>
          <h1>EdgeForms: forms all around the worlds</h1>
          <h2>Integrate forms into your website in minuts without pain in ass.</h2>
        </hgroup>
        <article style="padding:0">
          <Example />
        </article>

        <form edge="tsnc-lbyb-klyy-zk52">
          <input type="email" name="email" placeholder="Email" required />
          <button type="submit">Join Waitlist</button>
        </form>

        <h2>Test form</h2>
        <TestForm />
      </main>
    </Layout>
  )
}

function TestForm() {
  return (
    <form action={`/simple/tsnc-lbyb-klyy-zk52`} method="post">
      <label for="text">Text Input:</label>
      <div class="grid" style="grid-template-columns: 1fr;" id="texts">
        <input type="text" id="text" name="text" value="Text" required />
      </div>

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" value="How to validate?" />

      <label for="textarea">Textarea:</label>
      <textarea id="textarea" name="textarea" rows="4" cols="50">
        Long text
      </textarea>

      <fieldset>
        <label>Radio Buttons:</label>
        <input type="radio" id="cat" name="radio" value="cat" checked />
        <label for="cat">Cat Option</label>
        <input type="radio" id="dog" name="radio" value="dog" />
        <label for="dog">Dog Option</label>
      </fieldset>

      <fieldset>
        <label>Checkboxes:</label>
        <input type="checkbox" id="money" name="checkbox" value="money" checked />
        <label for="money">Money Option</label>
        <input type="checkbox" id="time" name="checkbox" value="time" checked />
        <label for="time">Time Option</label>
      </fieldset>

      <label for="dropdown">Dropdown List:</label>
      <select id="dropdown" name="dropdown">
        <option value="male">Male Option</option>
        <option value="female">Female Option</option>
      </select>

      <label for="dropdowns">Multiple Dropdown:</label>
      <select id="dropdowns" name="dropdowns" multiple>
        <option value="cloudflare" selected>
          Cloudflare Option
        </option>
        <option value="typescript" selected>
          TypeScript Option
        </option>
        <option value="hono" selected>
          Hono Option
        </option>
        <option value="htmx">HTMX Option</option>
      </select>
      <label for="file">File Upload:</label>
      <input type="file" id="file" name="file" />

      <label for="files">Multiple Files:</label>
      <input type="file" id="files" name="files" multiple />

      <label for="date">Date Input:</label>
      <input type="date" id="date" name="date" value="2023-08-18" />

      <label for="time">Time Input:</label>
      <input type="time" id="time" name="time" value="11:24" />

      <label for="datetime">Date and time Input:</label>
      <input type="datetime-local" id="datetime" name="datetime" />

      <label for="number">Number Input:</label>
      <input type="number" id="number" name="number" value="10" min="1" max="10" />

      <label for="email">Email Input:</label>
      <input type="email" id="email" name="email" value="roman@flurium.com" />

      <label for="url">URL Input:</label>
      <input type="url" id="url" name="url" value="https://flurium.com" />

      <label for="color">Color Picker:</label>
      <input type="color" id="color" name="color" value="#3949ab" />

      <label for="range">Range Input:</label>
      <input type="range" id="range" name="range" min="0" max="100" step="5" value="10" />

      <input type="hidden" name="honeypot" />

      <input type="submit" value="Submit" />
    </form>
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
