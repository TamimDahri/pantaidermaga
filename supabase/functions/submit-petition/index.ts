import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const { full_name, email, state, message, turnstileToken } = await req.json();

  if (!full_name || !email || !turnstileToken) {
    return Response.json({ error: "Maklumat tidak lengkap." }, { status: 400, headers: corsHeaders });
  }

  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: Deno.env.get("TURNSTILE_SECRET_KEY") ?? "",
      response: turnstileToken,
    }),
  });

  const verifyResult = await verify.json();

  if (!verifyResult.success) {
    return Response.json({ error: "Pengesahan keselamatan gagal." }, { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const verificationToken = crypto.randomUUID();

  const { error } = await supabase.from("petition_signatures").insert({
    full_name,
    email,
    state,
    message,
    verified: false,
    verification_token: verificationToken,
  });

  if (error?.code === "23505") {
    return Response.json({ error: "Email ini telah digunakan untuk menandatangani petisyen." }, { status: 409, headers: corsHeaders });
  }

  if (error) {
    return Response.json({ error: "Ralat berlaku. Sila cuba sebentar lagi." }, { status: 500, headers: corsHeaders });
  }

  const verifyUrl = `https://tscyudhqavjvriutxjle.supabase.co/functions/v1/verify-petition-email?token=${verificationToken}`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Pantai Dermaga <noreply@pantaidermaga.my>",
      to: email,
      subject: "Sahkan tandatangan petisyen Pantai Dermaga",
      html: `
        <h2>Terima kasih, ${full_name}</h2>
        <p>Sila klik pautan di bawah untuk mengesahkan tandatangan anda:</p>
        <p><a href="${verifyUrl}">Sahkan Tandatangan Saya</a></p>
      `,
    }),
  });

  return Response.json(
    { success: true, message: "Sila semak email untuk pengesahan." },
    { headers: corsHeaders }
  );
});