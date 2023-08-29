import type { RequestEvent } from "@sveltejs/kit"

export function setAuthCookie(event: RequestEvent, token: string) {
  const expiration = new Date()
  expiration.setDate(expiration.getDate() + 30)

  event.cookies.set("refresh-only", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: expiration
  })
}

export function getAuthCookie(event: RequestEvent) {
  return event.cookies.get("refresh-only")
}

export function removeAuthCookie(event: RequestEvent) {
  event.cookies.delete("refresh-only")
}
