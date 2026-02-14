import { z } from "zod";

// Workspace
export const createWorkspaceBody = z.object({
  name: z.string().optional(),
});
export type CreateWorkspaceBody = z.infer<typeof createWorkspaceBody>;

// Tender
export const createTenderBody = z.object({
  title: z.string().min(1).optional(),
});
export type CreateTenderBody = z.infer<typeof createTenderBody>;

export const updateTenderBody = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  submission_deadline: z.string().datetime().optional().nullable(),
  submission_link_note: z.string().optional().nullable(),
  reference_id: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  delivery_location: z.string().optional().nullable(),
});
export type UpdateTenderBody = z.infer<typeof updateTenderBody>;

// Tender items (BoQ)
export const tenderItemSchema = z.object({
  id: z.string().uuid().optional(),
  sort_order: z.number().int().min(0),
  description: z.string().min(1),
  quantity: z.number().min(0),
  unit: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});
export const putTenderItemsBody = z.object({
  items: z.array(tenderItemSchema),
});
export type TenderItemInput = z.infer<typeof tenderItemSchema>;
export type PutTenderItemsBody = z.infer<typeof putTenderItemsBody>;

// Required docs
export const requiredDocSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  required: z.boolean(),
  rejection_policy: z.record(z.unknown()).optional().nullable(),
  sort_order: z.number().int().min(0).optional(),
});
export const putRequiredDocsBody = z.object({
  docs: z.array(requiredDocSchema),
});
export type RequiredDocInput = z.infer<typeof requiredDocSchema>;
export type PutRequiredDocsBody = z.infer<typeof putRequiredDocsBody>;

// Ingest submission (MVP accelerator)
export const ingestSubmissionBody = z.object({
  vendor_name: z.string().min(1),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  items: z.array(
    z.object({
      tender_item_id: z.string().uuid(),
      unit_price: z.number().optional().nullable(),
      total: z.number().optional().nullable(),
    })
  ),
  docs: z
    .array(
      z.object({
        required_doc_id: z.string().uuid(),
        file_url: z.string().optional().nullable(),
        status: z.enum(["pending", "provided", "rejected"]).optional(),
      })
    )
    .optional(),
});
export type IngestSubmissionBody = z.infer<typeof ingestSubmissionBody>;

// Request missing docs
export const requestMissingDocsBody = z.object({
  message: z.string().optional(),
  doc_ids: z.array(z.string().uuid()).optional(),
});
export type RequestMissingDocsBody = z.infer<typeof requestMissingDocsBody>;

// Award
export const createAwardBody = z.object({
  tender_id: z.string().uuid(),
  submission_id: z.string().uuid(),
  notify_winner: z.boolean().optional(),
  notes: z.string().optional(),
});
export type CreateAwardBody = z.infer<typeof createAwardBody>;
