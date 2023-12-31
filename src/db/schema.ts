import { text, integer, blob, sqliteTable } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { uniqueId } from "../lib"

export const forms = sqliteTable("forms", {
  id: text("id").primaryKey().$defaultFn(uniqueId),
})
export const fields = sqliteTable("fields", {
  key: text("key").primaryKey().$defaultFn(uniqueId),

  formId: text("form_id")
    .references(() => forms.id)
    .notNull(),
})

type SubmissionField = {
  key: string
  values: string[]
}
export const submissions = sqliteTable("submissions", {
  id: text("id").primaryKey().$defaultFn(uniqueId),

  formId: text("form_id")
    .references(() => forms.id)
    .notNull(),

  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),

  fields: blob("fields", { mode: "json" }).$type<SubmissionField[]>().notNull(),
})

export const submissionFiles = sqliteTable("submission_files", {
  key: text("key").primaryKey().$defaultFn(uniqueId),
  bucket: text("bucket"),
  provider: text("provider", { enum: ["storj", "github"] }),

  submissionId: text("submission_id").references(() => submissions.id),
})

export const values = sqliteTable("values", {
  submissionId: text("submission_id")
    .notNull()
    .references(() => submissions.id),

  fieldId: text("field_id")
    .references(() => fields.key)
    .notNull(),
})
export type NewValue = typeof values.$inferInsert
