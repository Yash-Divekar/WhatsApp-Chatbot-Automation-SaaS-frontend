import { z } from "zod";

/**
 * Base Message Schema
 * Common fields for all messages
 */
const baseMessageSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  language: z.string().min(2),
  type: z.enum(["text", "image", "video", "document", "interactive"]),
  subtype: z.enum(["quick_reply", "list", "cta", "none"]).optional(),
  header_type: z.enum(["text", "image", "video", "document", "none"]).default("none"),
  header_data: z.string().optional(), // URL, media ID, or text
  body_data: z.string().optional(),   // Text, JSON string for interactive
  footer_data: z.string().max(256).optional(),
  extra_1: z.record(z.any()).optional(), // flexible extra data
  extra_2: z.record(z.any()).optional(),
  extra_3: z.record(z.any()).optional(),
  created_at: z.preprocess((arg) => new Date(arg), z.date()),
  updated_at: z.preprocess((arg) => new Date(arg), z.date()),
}).refine(
  (data) => data.header_type === "none" || (!!data.header_data && data.header_data.length > 0),
  {
    message: "header_data is required if header_type is not 'none'",
    path: ["header_data"],
  }
);

/**
 * Text Message Schema
 */
const textMessageSchema = baseMessageSchema.extend({
  type: z.literal("text"),
  subtype: z.literal("none"),
  header_type: z.literal("none"),
  body_data: z.string().min(1).max(4096),
});

/**
 * Image Message Schema
 */
const imageMessageSchema = baseMessageSchema.extend({
  type: z.literal("image"),
  header_type: z.literal("image"),
  header_data: z.string().url(),
  body_data: z.string().max(1024).optional(),
});

/**
 * Video Message Schema
 */
const videoMessageSchema = baseMessageSchema.extend({
  type: z.literal("video"),
  header_type: z.literal("video"),
  header_data: z.string().url(),
  body_data: z.string().max(1024).optional(),
});

/**
 * Document Message Schema
 */
const documentMessageSchema = baseMessageSchema.extend({
  type: z.literal("document"),
  header_type: z.literal("document"),
  header_data: z.string().url(),
  body_data: z.string().max(1024).optional(),
});

/**
 * Interactive Message Schema
 * Options / actions will be separate schemas
 */
const interactiveMessageSchema = baseMessageSchema.extend({
  type: z.literal("interactive"),
  subtype: z.enum(["quick_reply", "list", "cta"]),
  body_data: z.string().min(1), // JSON string containing actions
});

/**
 * WhatsApp Message - Discriminated Union for Type Safety
 */
export const WhatsAppMessageSchema = z.discriminatedUnion("type", [
  textMessageSchema,
  imageMessageSchema,
  videoMessageSchema,
  documentMessageSchema,
  interactiveMessageSchema,
]);
