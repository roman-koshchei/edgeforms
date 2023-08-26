import * as v from "valibot"

export * from "./validation"

// if we would want to switch into nanoid
export function uniqueId() {
  return crypto.randomUUID()
}

export function formFormat(from: FormData) {
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

export async function formInput<
  Schema extends v.BaseSchema | v.BaseSchemaAsync
>(form: FormData, key: string, schema: Schema) {
  const input = form.get(key)
  const validation = await v.safeParseAsync(schema, input)
  if (validation.success) return { value: validation.output }
  return { value: input, error: validation.issues[0].message }
}
