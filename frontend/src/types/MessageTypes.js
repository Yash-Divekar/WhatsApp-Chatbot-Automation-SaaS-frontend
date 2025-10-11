import { z } from 'zod';

/**
 * Base Message Schema
 * Common fields for all messages
 */
const baseMessageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  language: z.string().min(2).default("en"),
  type: z.enum(["text", "image", "video", "document", "interactive"]),
  subtype: z.enum(["quick_reply", "list", "cta", "none"]).optional(),
  header_type: z.enum(["text", "image", "video", "document", "none"]).default("none"),
  header_data: z.string().optional(),
  body_data: z.string().optional(),
  footer_data: z.string().max(256, "Footer too long (max 256 characters)").optional(),
  position: z.object({ 
    x: z.number(), 
    y: z.number() 
  }),
  buttons: z.array(z.object({
    id: z.string(),
    title: z.string().max(20, "Button title max 20 characters"),
    type: z.enum(["reply", "url", "phone"])
  })).optional(),
  listItems: z.array(z.object({
    id: z.string(),
    title: z.string().max(24, "Title max 24 characters"),
    description: z.string().max(72, "Description max 72 characters").optional()
  })).optional(),
  created_at: z.preprocess((arg) => {
    if (arg instanceof Date) return arg;
    if (typeof arg === 'string' || typeof arg === 'number') return new Date(arg);
    return new Date();
  }, z.date()).optional(),
  updated_at: z.preprocess((arg) => {
    if (arg instanceof Date) return arg;
    if (typeof arg === 'string' || typeof arg === 'number') return new Date(arg);
    return new Date();
  }, z.date()).optional(),
});

/**
 * Text Message Schema
 * Simple text-only messages
 */
export const textMessageSchema = baseMessageSchema.extend({
  type: z.literal("text"),
  subtype: z.literal("none").optional(),
  header_type: z.literal("none"),
  body_data: z.string()
    .min(1, "Message text is required")
    .max(4096, "Text too long (max 4096 characters)"),
});

/**
 * Image Message Schema
 * Image with optional caption
 */
export const imageMessageSchema = baseMessageSchema.extend({
  type: z.literal("image"),
  header_type: z.literal("image"),
  header_data: z.string()
    .url("Invalid image URL")
    .min(1, "Image URL is required"),
  body_data: z.string()
    .max(1024, "Caption too long (max 1024 characters)")
    .optional(),
});

/**
 * Video Message Schema
 * Video with optional caption
 */
export const videoMessageSchema = baseMessageSchema.extend({
  type: z.literal("video"),
  header_type: z.literal("video"),
  header_data: z.string()
    .url("Invalid video URL")
    .min(1, "Video URL is required"),
  body_data: z.string()
    .max(1024, "Caption too long (max 1024 characters)")
    .optional(),
});

/**
 * Document Message Schema
 * Document file with optional caption
 */
export const documentMessageSchema = baseMessageSchema.extend({
  type: z.literal("document"),
  header_type: z.literal("document"),
  header_data: z.string()
    .url("Invalid document URL")
    .min(1, "Document URL is required"),
  body_data: z.string()
    .max(1024, "Caption too long (max 1024 characters)")
    .optional(),
});

/**
 * Interactive Message Schema
 * Messages with buttons or lists
 */
export const interactiveMessageSchema = baseMessageSchema.extend({
  type: z.literal("interactive"),
  subtype: z.enum(["quick_reply", "list", "cta"], {
    errorMap: () => ({ message: "Invalid interactive type" })
  }),
  body_data: z.string()
    .min(1, "Message body is required")
    .max(1024, "Message body too long (max 1024 characters)"),
}).superRefine((data, ctx) => {
  // Validate buttons for quick_reply
  if (data.subtype === "quick_reply") {
    if (!data.buttons || data.buttons.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quick reply requires at least 1 button",
        path: ["buttons"]
      });
    }
    if (data.buttons && data.buttons.length > 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum 3 quick reply buttons allowed",
        path: ["buttons"]
      });
    }
    // Validate button titles
    if (data.buttons) {
      data.buttons.forEach((btn, idx) => {
        if (!btn.title || btn.title.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Button ${idx + 1} title is required`,
            path: ["buttons", idx, "title"]
          });
        }
      });
    }
  }

  // Validate listItems for list
  if (data.subtype === "list") {
    if (!data.listItems || data.listItems.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "List requires at least 1 item",
        path: ["listItems"]
      });
    }
    if (data.listItems && data.listItems.length > 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum 10 list items allowed",
        path: ["listItems"]
      });
    }
    // Validate list item titles
    if (data.listItems) {
      data.listItems.forEach((item, idx) => {
        if (!item.title || item.title.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `List item ${idx + 1} title is required`,
            path: ["listItems", idx, "title"]
          });
        }
      });
    }
  }

  // Validate buttons for cta
  if (data.subtype === "cta") {
    if (!data.buttons || data.buttons.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CTA requires at least 1 button",
        path: ["buttons"]
      });
    }
    if (data.buttons && data.buttons.length > 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum 2 CTA buttons allowed",
        path: ["buttons"]
      });
    }
    // Validate CTA button types and content
    if (data.buttons) {
      data.buttons.forEach((btn, idx) => {
        if (!btn.title || btn.title.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `CTA button ${idx + 1} title is required`,
            path: ["buttons", idx, "title"]
          });
        }
      });
    }
  }
});

/**
 * WhatsApp Message - Discriminated Union for Type Safety
 * This is the main schema that should be used for validation
 */
export const WhatsAppMessageSchema = z.discriminatedUnion("type", [
  textMessageSchema,
  imageMessageSchema,
  videoMessageSchema,
  documentMessageSchema,
  interactiveMessageSchema,
]);

/**
 * Workflow Schema
 * Complete workflow with nodes and connections
 */
export const WorkflowSchema = z.object({
  nodes: z.array(WhatsAppMessageSchema),
  connections: z.array(z.object({
    id: z.string(),
    from: z.string(),
    to: z.string(),
    buttonId: z.string().optional(),
  })),
  metadata: z.object({
    version: z.string().default("1.0"),
    name: z.string().optional(),
    description: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional(),
  }).optional(),
});

/**
 * Helper function to validate a single node
 */
export const validateNode = async (node) => {
  try {
    const validatedNode = await WhatsAppMessageSchema.parseAsync(node);
    return { success: true, data: validatedNode, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, data: null, errors: error.errors };
    }
    return { success: false, data: null, errors: [{ message: 'Unknown validation error' }] };
  }
};

/**
 * Helper function to validate entire workflow
 */
export const validateWorkflow = async (workflow) => {
  try {
    const validatedWorkflow = await WorkflowSchema.parseAsync(workflow);
    return { success: true, data: validatedWorkflow, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, data: null, errors: error.errors };
    }
    return { success: false, data: null, errors: [{ message: 'Unknown validation error' }] };
  }
};