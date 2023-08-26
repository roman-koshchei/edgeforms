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
      min: number
      max: number
    }

export type SubmissionField = {
  key: string
  values: string[]
}
