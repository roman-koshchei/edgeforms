import { removeAuthCookie } from "$lib/server/cookies"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
  removeAuthCookie(event)
  throw redirect(302, "/start")
}
