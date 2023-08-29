import { and, eq, sql } from "drizzle-orm"
import { db } from "../db"
import { users } from "../schema"

export async function selectUser(email: string) {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  const user = rows.at(0)
  return user
}

export async function userExist(id: string, version: number) {
  const rows = await db
    .select({ version: users.version })
    .from(users)
    .where(and(eq(users.id, id), eq(users.version, version)))
    .limit(1)

  return rows.length > 0
}

/** @returns user id */
export async function insertUser(email: string, passwordHash: string) {
  const rows = await db
    .insert(users)
    .values({
      email: email,
      passwordHash: passwordHash
    })
    .returning({ id: users.id, version: users.version })

  const user = rows.at(0)
  if (user == undefined) return null
  return { id: user.id, version: user.version }
}
