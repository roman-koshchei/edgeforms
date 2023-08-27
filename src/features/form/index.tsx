import { App } from "../.."
import { Field } from "../../db/types"
import { formFormat } from "../../lib"

/*

Pure server side forms. Works without JS.
To use add "action", "method" attributes to form element.

- check rate limits
- find form by id and permissions
- get form fields and files
- validate form fields
- check files size
- upload files to storage
- add submission to db
- send email if permission
- return redirect to page (saccess/fail)

*/

const MAX_FILE_SIZE = 10 * 1024 * 1024

function fileSizeAllowed(files: File[]) {
  for (let i = 0; i < files.length; ++i) {
    const file = files[i]
    if (file.size > MAX_FILE_SIZE) return false
  }
  return true
}

async function uploadFiles(files: File[]) {
  try {
    // upload files to storage
    // save files to database
    return true
  } catch {
    return false
  }
}

export function mapForm(app: App) {
  app.post("/form/:id", async (c) => {
    const form = await c.req.formData()

    const formated = formFormat(form)
    if (!fileSizeAllowed(formated.files)) return c.status(400)

    const uploaded = await uploadFiles(formated.files)
    if (!uploaded) return c.status(500)
  })
}
