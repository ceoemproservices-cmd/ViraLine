import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const WEBHOOK_URL =
  "https://warnereustace.app.n8n.cloud/webhook/b8f6b237-76b1-4485-ab02-803753a6a08f";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const upstream = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = text;
  }

  return new Response(JSON.stringify(payload), {
    status: upstream.status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
