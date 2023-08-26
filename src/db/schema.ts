import { text, integer, blob, sqliteTable } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { uniqueId } from "../lib"
import { FieldValidation, SubmissionField } from "./types"

export const forms = sqliteTable("forms", {
  id: text("id").primaryKey().$defaultFn(uniqueId),
})

export const fields = sqliteTable("fields", {
  id: text("id").primaryKey().$defaultFn(uniqueId),
  formId: text("form_id")
    .references(() => forms.id)
    .notNull(),

  // key is separated from id, because it can avoid pain in ass in future
  key: text("key").notNull(),
  // dangerous, but it's sqlite. anyway it will be mess.
  validation: blob("validation", { mode: "json" })
    .$type<FieldValidation>()
    .notNull(),
})

export const submissions = sqliteTable("submissions", {
  id: text("id").primaryKey().$defaultFn(uniqueId),

  formId: text("form_id")
    .references(() => forms.id)
    .notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

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
