import { supabase } from "../lib/supabase";

const form = document.querySelector("#admin-login-form") as HTMLFormElement | null;
const status = document.querySelector("#admin-login-status") as HTMLParagraphElement | null;

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!status) return;

  status.textContent = "Sedang login...";

  const formData = new FormData(form);

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    status.textContent = "Login gagal. Semak email atau password.";
    return;
  }

  window.location.href = "/admin";
});