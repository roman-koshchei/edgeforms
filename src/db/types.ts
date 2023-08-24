type MinMax = {
  min: number
  max: number
}

type Options = {
  options: string[]
}

type TextField = {
  type: "text"
  long: boolean // true if textarea
  optional: boolean
}

type EmailField = { type: "email"; optional: boolean }

// required means one is checked (set checked to highest)
type RadioField = {
  type: "radio"
  options: string[]
  optional: boolean
}

// required means at least 1 checked
type CheckboxField = Options & { type: "checkbox"; optional: boolean }

type SelectField = Options & {
  type: "select"
  multiple: boolean
}

type FileField = {
  type: "file"
  multiple: boolean
  optional: boolean
}

type DateTimeField = MinMax & { type: "date" | "time" | "datetime"; optional: boolean }

type NumberField = MinMax & { type: "number"; optional: boolean }

type PrimitiveField = { type: "url"; optional: boolean }

type ColorField = { type: "color"; optional: boolean }

type RangeField = MinMax & { type: "range"; optional: boolean }

// how ?
type Hidden = { type: "hidden"; optional: boolean }

type Field =
  | TextField
  | EmailField
  | RadioField
  | CheckboxField
  | SelectField
  | FileField
  | DateTimeField
  | NumberField
  | PrimitiveField
  | ColorField
  | RangeField
