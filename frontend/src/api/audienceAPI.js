import { api } from "./axios";
import { toast } from "sonner";

// ✅ Get paginated leads
export const getAudienceLeads = async (skip = 0, limit = 20, audience_id) => {
  try {
    const res = await api.get(`audience/`, {
      params: { skip, limit },
      headers: { "X-Audience-ID": audience_id },
    });
    if(res.status == 204){
      toast.warning(`No Leads for audience id : ${audience_id}`)
    }
    return res.data
  } catch (err) {
    toast.error("Failed to fetch audience leads. Please try again.");
    throw err;
  }
};

// ✅ Get lead by ID
export const getAudienceLead = async (leadId) => {
  try {
    const res = await api.get(`audience/${leadId}`);
    return res.data;
  } catch (err) {
    toast.error(`Failed to fetch lead details (ID: ${leadId}).`);
    throw err;
  }
};

// ✅ Create leads (single or bulk)
export const addAudienceLeads = async (dataList, listId) => {
  try {
    const res = await api.post(`audience/`, {
      meta: { list_id: listId },
      data: dataList,
    });

    const { created = [], errors = [] } = res.data;

    if (errors.length === dataList.length) {
      // 🔴 All failed
      toast.error(
        "All leads failed to add. Please check the file format or data."
      );
    } else if (errors.length === 0) {
      // ✅ All succeeded
      toast.success(
        created.length > 1
          ? `Successfully added ${created.length} leads.`
          : `Lead added successfully.`
      );
    } else {
      // 🔵 Partial success
      toast(
        `${created.length} leads added, ${errors.length} failed.`,
        {
          description: "Some leads were skipped due to errors.",
          icon: "ℹ️",
          style: { backgroundColor: "#3B82F6", color: "white" },
        }
      );
    }

    return res;
  } catch (err) {
    const message =
      err?.response?.data?.message || "Error adding leads. Please try again.";
    toast.error(message);
    console.error("Error adding leads:", message);
    throw err;
  }
};

// ✅ Delete a lead
export const deleteAudienceLead = async (leadId, archive = false) => {
  try {
    const res = await api.delete(`audience/${leadId}`, {
      params: { archive },
    });

    toast.success(
      archive ? "Lead archived successfully." : "Lead permanently deleted."
    );

    return res.data;
  } catch (err) {
    toast.error(`Failed to delete lead (ID: ${leadId}). Please try again.`);
    throw err;
  }
};
