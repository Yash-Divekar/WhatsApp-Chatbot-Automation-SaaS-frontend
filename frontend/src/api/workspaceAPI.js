import { api } from "./axios";
import { toast } from "sonner";

// Fetch workspaces (optionally filter active/inactive)
export const getWorkspaces = async (active = null) => {
  try {
    const res = await api.get("/workspaces", {
      params: active !== null ? { active } : {},
    });

    return res.data.data;
  } catch (err) {
    toast.error("Failed to load workspaces. Please try again.");
    throw err;
  }
};

// Fetch single workspace by ID
export const getWorkspaceById = async (id) => {
  try {
    const res = await api.get(`/workspaces/${id}`);
    console.log(res.data.data)
    return res.data.data;
  } catch (err) {
    toast.error(`Failed to load workspace (ID: ${id}).`);
    throw err;
  }
};

// Create a workspace
export const createWorkspace = async (data) => {
  try {
    const res = await api.post("/workspaces", data);
    toast.success("Workspace created successfully.");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to create workspace. Please try again.");
    throw err;
  }
};

// Update a workspace
export const updateWorkspace = async (id, data) => {
  try {
    const res = await api.put(`/workspaces/${id}`, data);
    toast.success("Workspace updated successfully.");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to update workspace. Please try again.");
    throw err;
  }
};

// Deactivate workspace (soft delete)
export const deactivateWorkspace = async (id) => {
  try {
    const res = await api.delete(`/workspaces/${id}`);
    toast.success("Workspace deactivated successfully.");
    return res.data;
  } catch (err) {
    toast.error("Failed to deactivate workspace. Please try again.");
    throw err;
  }
};

// Reactivate a workspace
export const activateWorkspace = async (id) => {
  try {
    const res = await api.post(`/workspaces/${id}/activate`);
    toast.success("Workspace reactivated successfully.");
    return res.data;
  } catch (err) {
    toast.error("Failed to reactivate workspace. Please try again.");
    throw err;
  }
};
