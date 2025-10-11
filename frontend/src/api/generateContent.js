import { api } from "./axios";

export const fetchMailContent = async (workspaceId, subject, model) => {
  if (!workspaceId || !subject) return null;

  try {
    const response = await api.post("/content/generate", {
      workspace_id: workspaceId,
      subject,
      tone: "professional",
      model
    });

    const { subject_line, preview_text, body_html, meta } = response?.data || {};

    return body_html ? { subject_line, preview_text, body_html, meta } : null;
  } catch (error) {
    console.error("Failed to generate email content:", error);
    return null;
  }
};

export const transformMailContent = async (
  currentContent,
  action,
  model = "openai/gpt-oss-20b:free",
  tone = "professional"
) => {
  if (!currentContent || !action) return null;

  try {
    const response = await api.post("/content/transform", {
      current_content: currentContent,
      action,
      tone,
      model
    });

    const { transformed_content } = response?.data || {};

    return transformed_content || null;
  } catch (error) {
    console.error("Failed to transform email content:", error);
    return null;
  }
};