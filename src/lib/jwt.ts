import { JWT_ISSUER, JWT_SECRET } from "$env/static/private"
import * as jose from "jose"
import * as v from "valibot"

const jwtClaimsSchema = v.object({
  id: v.string(),
  version: v.number()
})

type JwtClaims = v.Output<typeof jwtClaimsSchema>

export async function jwtCreateToken(claims: JwtClaims) {
  const secret = new TextEncoder().encode(JWT_SECRET)

  const token = await new jose.SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(JWT_ISSUER)
    .setExpirationTime("30days")
    .sign(secret)

  return token
}

export async function jwtValidateToken(
  token: string
): Promise<JwtClaims | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: JWT_ISSUER
    })

    const validation = await v.safeParseAsync(jwtClaimsSchema, payload)
    return validation.success ? validation.output : null
  } catch {
    return null
  }
}
