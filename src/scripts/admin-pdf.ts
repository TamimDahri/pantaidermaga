import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabase } from "../lib/supabase";
import QRCode from "qrcode";

const button = document.querySelector<HTMLButtonElement>("#download-pdf");

button?.addEventListener("click", async () => {
  button.disabled = true;
  button.textContent = "Generating PDF...";

  const { data, error } = await supabase
    .from("petition_signatures")
    .select("full_name,state,email,verified,created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    alert("Gagal jana PDF.");
    button.disabled = false;
    button.textContent = "Generate PDF";
    return;
  }

  const verified = data.filter((item) => item.verified);
  const unverified = data.length - verified.length;

  const stateStats = verified.reduce<Record<string, number>>((acc, item) => {
    const state = item.state || "Tidak dinyatakan";
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 790;

  page.drawText("PETISYEN RASMI", {
    x: 50,
    y,
    size: 22,
    font: bold,
    color: rgb(0.07, 0.24, 0.16),
  });

  y -= 35;

  page.drawText("Penjenamaan Nama Pantai Dermaga", {
    x: 50,
    y,
    size: 16,
    font: bold,
  });

  y -= 30;

  page.drawText(`Tarikh laporan: ${new Date().toLocaleDateString("ms-MY")}`, {
    x: 50,
    y,
    size: 11,
    font,
  });

  y -= 45;

  page.drawText("Ringkasan", {
    x: 50,
    y,
    size: 15,
    font: bold,
    color: rgb(0.07, 0.24, 0.16),
  });

  y -= 25;

  page.drawText(`Jumlah tandatangan: ${data.length}`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`Tandatangan disahkan: ${verified.length}`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`Belum disahkan: ${unverified}`, { x: 50, y, size: 12, font });

  y -= 45;

  page.drawText("Statistik Mengikut Negeri", {
    x: 50,
    y,
    size: 15,
    font: bold,
    color: rgb(0.07, 0.24, 0.16),
  });

  y -= 25;

  Object.entries(stateStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .forEach(([state, total]) => {
      page.drawText(`${state}: ${total}`, {
        x: 50,
        y,
        size: 11,
        font,
      });
      y -= 18;
    });

  y -= 25;

  page.drawText("10 Tandatangan Terkini Yang Disahkan", {
    x: 50,
    y,
    size: 15,
    font: bold,
    color: rgb(0.07, 0.24, 0.16),
  });

  y -= 25;

  verified.slice(0, 10).forEach((item, index) => {
    page.drawText(
      `${index + 1}. ${item.full_name} — ${item.state || "Malaysia"} — ${new Date(
        item.created_at
      ).toLocaleDateString("ms-MY")}`,
      {
        x: 50,
        y,
        size: 10,
        font,
      }
    );

    y -= 18;
  });

  page.drawText("Dijana secara automatik melalui https://pantaidermaga.my", {
    x: 50,
    y: 45,
    size: 9,
    font,
    color: rgb(0.4, 0.36, 0.3),
  });

  const qrDataUrl = await QRCode.toDataURL(
  "https://pantaidermaga.my",
  {
    width: 180,
    margin: 1,
  }
);

const qrBytes = await fetch(qrDataUrl).then((r) => r.arrayBuffer());

const qrImage = await pdf.embedPng(qrBytes);

page.drawImage(qrImage, {
  x: 420,
  y: 40,
  width: 120,
  height: 120,
});

page.drawText("Imbas untuk melihat", {
  x: 415,
  y: 25,
  size: 10,
  font,
});

page.drawText("petisyen rasmi", {
  x: 420,
  y: 12,
  size: 10,
  font,
});

  const bytes = await pdf.save();

  const blob = new Blob([bytes], {
    type: "application/pdf",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "Laporan-Petisyen-Pantai-Dermaga.pdf";
  link.click();

  URL.revokeObjectURL(url);

  button.disabled = false;
  button.textContent = "Generate PDF";
});