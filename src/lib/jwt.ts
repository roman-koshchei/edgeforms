import * as jose from "jose"

type JwtClaims = {
  uid: string
  version: number
}

type JwtSecrets = {
  issuer: string
  audience: string
  secret: string
}

export async function jwtCreateToken(claims: JwtClaims, secrets: JwtSecrets) {
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

export async function jwtValidateToken(token: string, secrets: JwtSecrets) {
  const secret = new TextEncoder().encode(secrets.secret)
  const { payload } = await jose.jwtVerify(token, secret, {
    issuer: secrets.issuer,
    audience: secrets.audience,
  })
}
