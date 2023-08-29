// if we would want to switch into nanoid
export function uniqueId() {
  return crypto.randomUUID()
}
import * as jose from "jose"
import * as v from "valibot"

type JwtSecrets = {
  issuer: string
  audience: string
  secret: string
}

const jwtClaimsSchema = v.object({
  uid: v.string(),
  version: v.number(),
  iat: v.number(),
  exp: v.number()
})

type JwtClaims = v.Output<typeof jwtClaimsSchema>

type InputJwtClaims = {
  uid: string
  version: number
}

export async function jwtCreateToken(
  claims: InputJwtClaims,
  secrets: JwtSecrets
) {
  const secret = new TextEncoder().encode(secrets.secret)

  const token = await new jose.SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(secrets.issuer)
    .setAudience(secrets.audience)
    .setExpirationTime("30days")
    .sign(secret)

  return token
}

export async function jwtValidateToken(
  token: string,
  secrets: JwtSecrets
): Promise<JwtClaims | null> {
  try {
    const secret = new TextEncoder().encode(secrets.secret)
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: secrets.issuer,
      audience: secrets.audience
    })

    const validation = await v.safeParseAsync(jwtClaimsSchema, payload)
    return validation.success ? validation.output : null
  } catch {
    return null
  }
}
