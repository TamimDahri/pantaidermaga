import { supabase } from "../lib/supabase";

const button = document.querySelector("#export-csv") as HTMLButtonElement | null;

button?.addEventListener("click", async () => {
  button.disabled = true;
  button.textContent = "Exporting...";

  const { data, error } = await supabase
    .from("petition_signatures")
    .select("full_name,email,state,message,created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    alert("Gagal export CSV.");
    button.disabled = false;
    button.textContent = "Export CSV";
    return;
  }

  const headers = ["Nama", "Email", "Negeri", "Mesej", "Tarikh"];

  const rows = data.map((item) => [
    item.full_name,
    item.email,
    item.state || "",
    item.message || "",
    new Date(item.created_at).toLocaleString("ms-MY"),
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "petisyen-pantai-dermaga.csv";
  link.click();

  URL.revokeObjectURL(url);

  button.disabled = false;
  button.textContent = "Export CSV";
});