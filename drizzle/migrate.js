import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"
import { createClient } from "@libsql/client"
import { minLength, safeParse, string } from "valibot"

function env(key) {
  const variable = process.env[key]
  const valid = safeParse(string([minLength(1)]), variable)
  if (valid.success) return valid.output

  const message = `missing ${key} env var`
  throw new Error(message)
}

async function main() {
  const url = env("DB_URL")
  const token = env("DB_AUTH_TOKEN")

  const client = createClient({ url: url, authToken: token })
  const db = drizzle(client)

  await migrate(db, { migrationsFolder: "drizzle" })
}

main().catch((e) => {
  console.error("Migration failed")
  console.error(e)
  process.exit(1)
})
