import type { BaseSchema } from "valibot"
import type { Actions, PageServerLoad } from "./$types"
import { Resend } from "resend"
import * as v from "valibot"
import bcrypt from "bcryptjs"
import { insertUser, selectUser, userExist } from "$lib/server/repo/user"
import { jwtCreateToken, jwtValidateToken } from "$lib"
import { redirect, type RequestEvent } from "@sveltejs/kit"
import {
  getAuthCookie,
  removeAuthCookie,
  setAuthCookie
} from "$lib/server/cookies"
import { RESEND_API_KEY } from "$env/static/private"

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

const resend = new Resend(RESEND_API_KEY)

async function authUser(email: string, password: string) {
  const user = await selectUser(email)
  if (user != undefined) {
    const correctPassword = await bcrypt.compare(password, user.passwordHash)
    return correctPassword ? { id: user.id, version: user.version } : null
  }

  const hash = await bcrypt.hash(password, 12)
  const claims = await insertUser(email, hash)
  if (claims == null) return null

  const confirmationLink = ""

  try {
    await resend.emails.send({
      from: "roman@flurium.com",
      to: [email],
      subject: "Confirm EdgeForms account",
      html: `Use link to <a href="${confirmationLink}">Confirm account</a>`
    })
  } catch {}

  return claims
}

export const load: PageServerLoad = async (event) => {
  const cookie = getAuthCookie(event)
  if (cookie == undefined) return

  const claims = await jwtValidateToken(cookie)
  if (claims == null) return

  const exist = await userExist(claims.id, claims.version)
  if (exist) throw redirect(302, "/dashboard")

  removeAuthCookie(event)
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
