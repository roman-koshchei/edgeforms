import * as v from "valibot"

export const passwordSchema = v.string("Password is missing.", [
  v.minLength(8, "Password should be 8 or more symbols"),
])

export const emailSchema = v.string("Email is missing or not valid.", [
  v.email("Email isn't valid."),
])
