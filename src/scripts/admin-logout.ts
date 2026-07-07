import { supabase } from "../lib/supabase";

const button = document.querySelector("#admin-logout") as HTMLButtonElement | null;

button?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "/admin-login";
});