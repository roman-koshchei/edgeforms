import { insertForm, insertSubmission, selectFormFields } from "$lib/form/db"
import { validateFields } from "$lib/form/validation"
import { error, redirect, type RequestHandler } from "@sveltejs/kit"

function uniqueId() {
  return crypto.randomUUID()
}

type FormFile = { id: string; data: File }

type Form = {
  files: FormFile[]
  fields: { key: string; values: string[] }[]
}

function formFormat(formData: FormData): Form {
  let result: Form = { files: [], fields: [] }

  const entries = formData.entries() as IterableIterator<
    [key: string, value: File | string]
  >
  for (const [formKey, formValue] of entries) {
    let value: string
    if (formValue instanceof File) {
      value = uniqueId()
      result.files.push({ id: value, data: formValue })
    } else {
      value = formValue
    }

    const existingField = result.fields.find((field) => field.key == formKey)
    if (existingField != undefined) {
      existingField.values.push(value)
    } else {
      result.fields.push({ key: formKey, values: [value] })
    }
  }
  return result
}
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

async function uploadFiles(
  files: FormFile[]
): Promise<
  { key: string; bucket: string; provider: "storj" | "github" }[] | null
> {
  try {
    // upload files to storage
    // save files to database
    return []
  } catch {
    return null
  }
}

export const POST: RequestHandler = async ({ request, params }) => {
  const id = params.id
  if (!id) throw error(404)

  const body = await request.formData()
  console.log(JSON.stringify(formFormat(body)))

  const formId = await insertForm([
    {
      key: "email",
      validation: {
        type: "email",
        required: true
      }
    }
  ])
  console.log(formId)
  const formFields = await selectFormFields(id)

  if (formFields.length == 0) {
    // form not found
  }

  const formated = formFormat(form)
  if (!fileSizeAllowed(formated.files.map((x) => x.data))) {
    // error
  }

  let files: StorageFile[] = []
  if (formated.files.length > 0) {
    const uploaded = await uploadFiles(formated.files)
    if (!uploaded) return c.status(500)
    files = uploaded
  }

  const validation = await validateFields(formFields, formated)
  if (validation.errors.length > 0) {
    // error
  }

  const inserted = await insertSubmission(
    id,
    validation.fields.map((x) => {
      // stoopid
      return {
        fieldKey: x.key,
        values: x.values
      }
    }),
    files
  )
  if (!inserted) {
    // delete uploaded files
  }

  throw redirect(302, "/")
}
