import * as v from "valibot"
import type { Field, FieldValidation, SubmissionField } from "../../db/types"

const dbFields: Field[] = [
  {
    key: "email",
    validation: { type: "email", required: true },
  },
  {
    key: "files",
    validation: { type: "file", multiple: true, required: true },
  },
  {
    key: "gender",
    validation: { type: "radio", options: ["male", "female"], required: true },
  },
  {
    key: "fruits",
    validation: { type: "checkbox", options: ["apple", "banana"] },
  },
]

function buildValidation({ key, validation }: Field) {
  if (validation.type == "text") {
    if (validation.required) {
      return v.string(`${key} must be string.`)
    }
    return v.optional(v.string(`${key} is required and must be string.`))
  }

  if (validation.type == "email") {
    if (validation.required) {
      return v.string(`${key} must be string.`)
    } else {
      return v.optional(v.string(`${key} is required and must be string.`))
    }
  }
}

function buildAllValidation(fields: Field[]) {
  for (let i = 0; i < fields.length; ++i) {
    const field = fields[i]
  }
}

function stringToNumber(value: string) {
  try {
    const num = parseFloat(value)
    if (isNaN(num)) return null
    return num
  } catch {
    return null
  }
}

type ValidationResult =
  | [valid: true, errors: null]
  | [valid: false, errors: string[]]

async function parseValidation(
  schema: v.BaseSchema,
  values: string[]
): Promise<ValidationResult> {
  const res = await v.safeParseAsync(schema, values)
  return res.success ? [true, null] : [false, res.issues.map((x) => x.message)]
}

async function validate(
  { key, validation }: Field,
  values: string[]
): Promise<ValidationResult> {
  if (validation.type == "text") {
    const schema = v.array(
      v.string(`${key} must be string.`),
      validation.required ? [v.minLength(1, `${key} is required.`)] : undefined
    )
    return await parseValidation(schema, values)
  }

  if (validation.type == "email") {
    const schema = v.array(
      v.string(`${key} must be valid email.`, [
        v.email(`${key} must be valid email.`),
      ]),
      validation.required ? [v.minLength(1, `${key} is required.`)] : undefined
    )
    return await parseValidation(schema, values)
  }

  if (validation.type == "number") {
    var numbers = []
    for (let i = 0; i < values.length; ++i) {
      const value = values[i]
      const num = stringToNumber(value)
      if (num == null) return [false, [`${key} value must be a number.`]]
      numbers.push(num)
    }

    if (validation.required && numbers.length < 1) {
      return [false, [`${key} is required.`]]
    }

    return [true, null]
  }

  if (validation.type == "radio") {
    if (values.length == 0) {
      return validation.required
        ? [false, [`${key} is required.`]]
        : [true, null]
    }
    if (validation.options.length == 0) return [true, null]

    for (let i = 0; i < values.length; ++i) {
      const value = values[i].trim()
      const possible = validation.options.some((x) => x == value)
      if (!possible) {
        return [false, [`${key} value doesn't match any of possible options.`]]
      }
    }
    return [true, null]
  }

  if (validation.type == "color") {
    const schema = v.array(
      v.string(`${key} must be a hex color`, [v.length(7), v.startsWith("#")]),
      validation.required ? [v.minLength(1)] : undefined
    )
    return parseValidation(schema, values)
  }

  if (validation.type == "url") {
    const schema = v.array(
      v.string([v.url()]),
      validation.required ? [v.minLength(1, `${key} is required.`)] : undefined
    )
    return parseValidation(schema, values)
  }

  if (validation.type == "checkbox") {
    if (values.length == 0) return [true, null]
    for (let i = 0; i < values.length; ++i) {
      const value = values[i].trim()
      const possible = validation.options.some((x) => x == value)
      if (!possible) {
        return [false, [`${key} value doesn't match any of possible options.`]]
      }
    }
    return [true, null]
  }

  if (validation.type == "select") {
    if (values.length == 0) return [true, null]
    for (let i = 0; i < values.length; ++i) {
      const value = values[i].trim()
      const possible = validation.options.some((x) => x == value)
      if (!possible) {
        return [false, [`${key} value doesn't match any of possible options.`]]
      }
    }
    return [true, null]
  }

  if (validation.type == "range") {
    if (values.length == 0) {
      return validation.required
        ? [false, [`${key} is required.`]]
        : [true, null]
    }

    var numbers = []
    for (let i = 0; i < values.length; ++i) {
      const num = stringToNumber(values[i])
      if (num == null) return [false, [`${key} value must be a number.`]]
      numbers.push(num)
    }

    if (validation.min != undefined) {
      const min = validation.min
      if (numbers.some((x) => x < min)) {
        return [false, [`${key} value must be a larger than ${min}`]]
      }
    }

    if (validation.max != undefined) {
      const max = validation.max
      if (numbers.some((x) => x < max)) {
        return [false, [`${key} value must be a less than ${max}`]]
      }
    }

    return [true, null]
  }

  if (validation.type == "date") {
    if (values.length == 0) {
      return validation.required
        ? [false, [`${key} is required.`]]
        : [true, null]
    }

    const schema = v.array(v.string([v.isoDate()]))
    return parseValidation(schema, values)
  }

  if (validation.type == "time") {
    if (values.length == 0) {
      return validation.required
        ? [false, [`${key} is required.`]]
        : [true, null]
    }

    const schema = v.array(v.string([v.isoTime()]))
    return parseValidation(schema, values)
  }

  if (validation.type == "datetime") {
    if (values.length == 0) {
      return validation.required
        ? [false, [`${key} is required.`]]
        : [true, null]
    }

    const schema = v.array(v.string([v.isoDateTime()]))
    return parseValidation(schema, values)
  }

  if (validation.type == "file") {
    // ??????
    /*


    ???


    */
  }

  return [false, ["Field isn't found."]]
}

async function validateFields(fields: SubmissionField[]) {
  let submissionFields = []

  for (let i = 0; i < dbFields.length; ++i) {
    const dbField = dbFields[0]
    const field = fields.find((x) => x.key == dbField.key)
  }
}
