declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };
  }
}

const form = document.querySelector<HTMLFormElement>("#petition-form");
const statusEl = document.querySelector<HTMLParagraphElement>("#petition-status");
const counter = document.querySelector<HTMLElement>("[data-petition-count]");
const buttonEl = form?.querySelector<HTMLButtonElement>("button[type='submit']");

const FUNCTION_URL =
  "https://tscyudhqavjvriutxjle.supabase.co/functions/v1/submit-petition";

if (!form || !statusEl || !buttonEl) {
  throw new Error("Petition form elements not found.");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const tokenInput = document.querySelector<HTMLInputElement>(
    'input[name="cf-turnstile-response"]'
  );

  const turnstileToken = tokenInput?.value;

  if (!turnstileToken) {
    statusEl.textContent = "Sila lengkapkan pengesahan keselamatan.";
    return;
  }

  buttonEl.disabled = true;
  buttonEl.textContent = "Sedang menghantar...";
  statusEl.textContent = "";

  const formData = new FormData(form);

  try {
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: formData.get("full_name"),
        email: formData.get("email"),
        state: formData.get("state"),
        message: formData.get("message"),
        turnstileToken,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      statusEl.textContent =
        result.error || "Ralat berlaku. Sila cuba sebentar lagi.";

      window.turnstile?.reset();
      return;
    }

    // if (counter) {
    //   const current = Number(counter.textContent?.replace(/,/g, "") || 0);
    //   counter.textContent = (current + 1).toLocaleString("ms-MY");
    // }

    statusEl.textContent =
  result.message || "Sila semak email untuk mengesahkan tandatangan anda.";
    form.reset();
    window.turnstile?.reset();
  } catch {
    statusEl.textContent = "Ralat sambungan. Sila cuba semula.";
  } finally {
    buttonEl.disabled = false;
    buttonEl.textContent = "Tandatangani Sekarang";
  }
});

export {};