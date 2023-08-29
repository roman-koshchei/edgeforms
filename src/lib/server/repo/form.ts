import { eq } from "drizzle-orm"
import type { Field, StorageFile } from "$lib/types"
import {
  fields as formFields,
  forms,
  submissionFields,
  submissionFiles,
  submissions
} from "$lib/server/schema"
import { db } from "$lib/server/db"

export async function insertForm(fields: Field[]) {
  return await db.transaction(async (tx) => {
    const [form] = await tx.insert(forms).values({}).returning()

    await tx.insert(formFields).values(
      fields.map((x) => {
        return {
          key: x.key,
          validation: x.validation,
          formId: form.id
        }
      })
    )

    return form.id
  })
}

export async function insertSubmission(
  formId: string,
  fields: { fieldKey: string; values: string[] }[],
  files: StorageFile[]
) {
  try {
    await db.transaction(async (tx) => {
      const [submission] = await tx
        .insert(submissions)
        .values({ formId: formId })
        .returning()

      await tx.insert(submissionFields).values(
        fields.map((x) => {
          return {
            submissionId: submission.id,
            fieldKey: x.fieldKey,
            values: x.values
          }
        })
      )

      await tx.insert(submissionFiles).values(
        files.map((x) => {
          return {
            key: x.key,
            bucket: x.bucket,
            provider: x.provider,
            submissionId: submission.id
          }
        })
      )
    })
    return true
  } catch {
    return false
  }
}

export async function selectFormFields(formId: string) {
  return await db
    .select({
      key: formFields.key,
      validation: formFields.validation
    })
    .from(formFields)
    .where(eq(formFields.formId, formId))
    .all()
}
