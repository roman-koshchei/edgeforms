export type Field = {
  key: string
  validation: FieldValidation
}

export type SubmissionField = {
  key: string
  values: string[]
}

/*

Think 100 times to change it. DON'T BREAK!

*/
export type FieldValidation =
  | {
      type: "text"
      required: boolean
    }
  | {
      type: "email"
      required: boolean
    }
  | {
      type: "radio"
      options: string[]
      required: boolean
    }
  | {
      type: "checkbox"
      options: string[]
    }
  | {
      type: "select"
      options: string[]
      multiple: boolean
    }
  | {
      type: "file"
      multiple: boolean
      required: boolean
    }
  | {
      type: "date" | "time" | "datetime"
      required: boolean
    }
  | {
      type: "number"
      required: boolean
    }
  | {
      type: "url"
      required: boolean
    }
  | {
      type: "color"
      required: boolean
    }
  | {
      type: "range"
      required: boolean
      min?: number
      max?: number
    }
