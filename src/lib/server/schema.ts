import {
  text,
  integer,
  blob,
  sqliteTable,
  primaryKey
} from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { fileProviders, type FieldValidation } from "../types"

export function uniqueId() {
  return crypto.randomUUID()
}

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(uniqueId),
  version: integer("version").notNull().default(0),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull()
})

export const forms = sqliteTable("forms", {
  id: text("id").primaryKey().$defaultFn(uniqueId)
})

export const fields = sqliteTable(
  "fields",
  {
    key: text("key").notNull(),
    validation: blob("validation", { mode: "json" })
      .$type<FieldValidation>()
      .notNull(),

    formId: text("form_id")
      .references(() => forms.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull()
  },
  (table) => {
    // maybe one day i will regret but looks like no
    return {
      pk: primaryKey(table.key, table.formId)
    }
  }
)

export const submissions = sqliteTable("submissions", {
  id: text("id").primaryKey().$defaultFn(uniqueId),

  formId: text("form_id")
    .references(() => forms.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})

export const submissionFields = sqliteTable(
  "submission_fields",
  {
    submissionId: text("submission_id")
      .notNull()
      .references(() => submissions.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
      }),

    fieldKey: text("field_key")
      .notNull()
      .references(() => fields.key, {
        onDelete: "cascade",
        onUpdate: "cascade"
      }),

    values: blob("values", { mode: "json" }).$type<string[]>().notNull()
  },
  (table) => {
    return {
      pk: primaryKey(table.fieldKey, table.submissionId)
    }
  }
)

export const submissionFiles = sqliteTable("submission_files", {
  key: text("key").primaryKey().notNull(),
  bucket: text("bucket").notNull(),
  provider: text("provider", { enum: fileProviders }).notNull(),

  submissionId: text("submission_id")
    .references(() => submissions.id, {
      onDelete: "cascade",
      onUpdate: "cascade"
    })
    .notNull()
})
