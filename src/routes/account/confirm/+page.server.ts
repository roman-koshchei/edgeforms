import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { db } from "$lib/server/db"
import { userTokens, users } from "$lib/server/schema"
import { and, eq } from "drizzle-orm"

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get("token")
  if (token == null || token == "") {
    throw error(400, "Email confirmation token isn't provided.")
  }

  const id = url.searchParams.get("id")
  if (id == null || id == "") {
    throw error(400, "User isn't identified.")
  }

  const emailToken = await db
    .select({
      expires: userTokens.expires,
      userId: userTokens.userId
    })
    .from(userTokens)
    .where(and(eq(userTokens.id, token), eq(userTokens.type, "confirm-email")))
    .get()
  if (emailToken == undefined) {
    throw error(404, "Email token isn't found. Try to get new one.")
  }

  if (emailToken.expires < new Date()) {
    await db.delete(userTokens).where(eq(userTokens.id, token))
    throw error(500, "Token has expired.")
  }

  db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ emailConfirmed: true })
      .where(eq(users.id, emailToken.userId))

    await db.delete(userTokens).where(eq(userTokens.id, token))
  })
}
