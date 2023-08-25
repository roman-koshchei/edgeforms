import { Hono } from "hono"
import { html } from "hono/html"
import { Layout } from "./frontend"
import { Example } from "./frontend/example"
import { uniqueId } from "./lib"
import { Landing } from "./frontend/landing"
import { StartPage } from "./frontend/auth"

const app = new Hono()

function formFormat(from: FormData) {
  let result = {
    files: [] as File[],
    fields: [] as { key: string; values: string[] }[],
  }
  const entries = from.entries() as IterableIterator<
    [key: string, value: File | string]
  >
  for (const [key, value] of entries) {
    let str: string
    if (value instanceof File) {
      str = `${uniqueId()}`
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

app.get("/", (c) => c.html(<Landing />))
app.get("/start", (c) => c.html(<StartPage />))

const forms = [
  { id: "tsnc-lbyb-klyy-zk52", userId: "t86c-l34b-klyy-z952", redirect: "/" },
  {
    id: "tqkl-l45b-oplt-mz72",
    userId: "t86c-l34b-klyy-z952",
    redirect: "/about",
  },
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

export default app
