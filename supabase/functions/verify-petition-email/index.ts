import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("Token tidak sah.", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { error } = await supabase
    .from("petition_signatures")
    .update({
      verified: true,
      verification_token: null,
    })
    .eq("verification_token", token);

  if (error) {
    return new Response("Gagal sahkan tandatangan.", { status: 500 });
  }

  return Response.redirect("https://pantaidermaga.my/?verified=success", 302);
});