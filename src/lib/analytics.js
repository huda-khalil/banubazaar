import { supabase } from "./supabase";

// Generate a unique visitor ID (stored in localStorage)
const getVisitorId = () => {
  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
};

export const trackPageView = async (page) => {
  try {
    const { error } = await supabase.from("page_views").insert([
      {
        page: page,
        visitor_id: getVisitorId(),
        user_agent: navigator.userAgent,
      },
    ]);

    if (error) console.error("Supabase error:", error);
  } catch (err) {
    console.error("Failed to track page view:", err);
  }
};
