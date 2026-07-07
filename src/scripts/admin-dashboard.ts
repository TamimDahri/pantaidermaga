import { supabase } from "../lib/supabase";

const page = document.querySelector("#admin-page") as HTMLElement | null;
const countEl = document.querySelector("#admin-count") as HTMLElement | null;
const tbody = document.querySelector("#admin-signatures") as HTMLTableSectionElement | null;

const { data: sessionData } = await supabase.auth.getSession();

if (!sessionData.session) {
  window.location.href = "/admin-login";
} else {
  if (page) page.hidden = false;

  const { count } = await supabase
    .from("petition_signatures")
    .select("*", { count: "exact", head: true });

  if (countEl) {
    countEl.textContent = (count ?? 0).toLocaleString("ms-MY");
  }

  const { data, error } = await supabase
    .from("petition_signatures")
    .select("full_name,email,state,message,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (!error && tbody && data) {
    tbody.innerHTML = data
      .map(
        (item) => `
          <tr>
            <td>${item.full_name}</td>
            <td>${item.email}</td>
            <td>${item.state || "-"}</td>
            <td>${item.message || "-"}</td>
            <td>${new Date(item.created_at).toLocaleString("ms-MY")}</td>
          </tr>
        `
      )
      .join("");
  }
}