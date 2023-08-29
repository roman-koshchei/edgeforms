import type { BaseSchema } from "valibot"
import type { Actions } from "./$types"
import * as v from "valibot"
import bcrypt from "bcryptjs"
import { insertUser, selectUser } from "$lib/server/repo/user"
import { jwtCreateToken } from "$lib"
import { redirect, type RequestEvent } from "@sveltejs/kit"

type FormStructure = {
  [key: string]: BaseSchema
}

type ValidatedForm<T extends FormStructure> = {
  [key in keyof T]: v.Output<T[key]>
}

async function validateFormData<T extends FormStructure>(
  formData: FormData,
  structure: T
): Promise<
  | { data: ValidatedForm<T>; error?: undefined }
  | { data?: undefined; error: string }
> {
  const result = {} as ValidatedForm<T>

  for (let key in structure) {
    const schema = structure[key]
    var validation = await v.safeParseAsync(schema, formData.get(key))
    if (!validation.success) return { error: validation.issues[0].message }
    result[key] = validation.output
  }

  return { data: result }
}

async function authUser(email: string, password: string) {
  const user = await selectUser(email)
  if (user != undefined) {
    const correctPassword = await bcrypt.compare(password, user.passwordHash)
    return correctPassword ? { id: user.id, version: user.version } : null
  }

  const hash = await bcrypt.hash(password, 12)
  return insertUser(email, hash)
}

function setAuthCookie(event: RequestEvent, token: string) {
  const expiration = new Date()
  expiration.setDate(expiration.getDate() + 30)

  event.cookies.set("refresh-only", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: expiration
  })
}

export const actions = {
  default: async (event) => {
    const formData = await event.request.formData()

    const { data, error } = await validateFormData(formData, {
      email: v.string([v.email("Email isn't valid")]),
      password: v.string([
        v.minLength(6, "Password should be at least 6 characters long.")
      ])
    })
    if (error != undefined) return { error: error }

    const userClaims = await authUser(data.email, data.password)
    if (userClaims == null) {
      return { error: "Password is incorrect." }
    }

    const token = await jwtCreateToken(userClaims)
    setAuthCookie(event, token)

    throw redirect(302, "/dashboard")
  }
} satisfies Actions
